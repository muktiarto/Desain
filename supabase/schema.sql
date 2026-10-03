-- ============================================================================
-- PRD: APLIKASI PEMESANAN JASA DESAIN GRAFIS (DesainKu)
-- Supabase PostgreSQL Schema & Security Rules (Row Level Security - RLS)
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABEL PROFILES (Data pengguna & role)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nama TEXT NOT NULL,
  no_whatsapp TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Komentar Tabel
COMMENT ON TABLE public.profiles IS 'Profil akun pengguna DesainKu (pelanggan & admin).';

-- 3. TABEL ORDERS (Data Pesanan Desain)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  jenis_desain TEXT NOT NULL CHECK (jenis_desain IN ('flyer', 'banner')),
  ukuran TEXT NOT NULL,
  teks TEXT NOT NULL,
  warna TEXT NOT NULL,
  catatan TEXT,
  status TEXT NOT NULL DEFAULT 'baru' CHECK (status IN ('baru', 'dikerjakan', 'selesai')),
  harga INTEGER, -- dalam Rupiah (diisi admin)
  tanggal_pesan TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  batas_waktu DATE, -- diisi admin
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

COMMENT ON TABLE public.orders IS 'Daftar pesanan flyer dan banner dari pelanggan.';

-- 4. TABEL ORDER_IMAGES (Contoh gambar referensi)
CREATE TABLE IF NOT EXISTS public.order_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

COMMENT ON TABLE public.order_images IS 'Daftar file gambar contoh/referensi pesanan.';

-- 5. FUNCTION & TRIGGER: Auto-create Profile saat User Baru Sign Up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, nama, no_whatsapp, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'nama', 'Pengguna Baru'),
    COALESCE(new.raw_user_meta_data->>'no_whatsapp', '-'),
    'customer' -- Pelanggan bawaan selalu customer
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger Auto-update 'updated_at' di orders
CREATE OR REPLACE FUNCTION public.handle_order_updated()
RETURNS trigger AS $$
BEGIN
  new.updated_at = timezone('utc'::text, now());
  RETURN new;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_order_updated ON public.orders;
CREATE TRIGGER on_order_updated
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_order_updated();

-- 6. HELPER FUNCTION: is_admin() dengan SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 7. ATURAN KEAMANAN ROW LEVEL SECURITY (RLS) WAJIB AKTIF
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_images ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- Kebijakan RLS: PROFILES
-- ----------------------------------------------------------------------------
-- Pengguna boleh melihat profilnya sendiri. Admin boleh melihat semua.
CREATE POLICY "Pengguna lihat profil sendiri atau admin lihat semua"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

-- Pengguna boleh mengubah nama dan no_whatsapp miliknya sendiri (TIDAK BOLEH ubah role)
CREATE POLICY "Pengguna ubah profil sendiri non-role"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
  );

-- ----------------------------------------------------------------------------
-- Kebijakan RLS: ORDERS
-- ----------------------------------------------------------------------------
-- Pelanggan boleh melihat pesanan miliknya sendiri. Admin boleh melihat semua pesanan.
CREATE POLICY "Pelanggan lihat pesanan sendiri dan Admin lihat semua"
  ON public.orders FOR SELECT
  USING (customer_id = auth.uid() OR public.is_admin());

-- Pelanggan boleh menambah pesanan hanya jika customer_id sama dengan id dirinya dan status = 'baru'
CREATE POLICY "Pelanggan buat pesanan baru miliknya"
  ON public.orders FOR INSERT
  WITH CHECK (
    customer_id = auth.uid() 
    AND status = 'baru'
  );

-- Hanya Admin yang boleh mengubah pesanan (status, harga, batas waktu)
CREATE POLICY "Admin dapat mengubah pesanan"
  ON public.orders FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Tidak ada policy DELETE (tidak boleh dihapus lewat aplikasi versi 1)

-- ----------------------------------------------------------------------------
-- Kebijakan RLS: ORDER_IMAGES
-- ----------------------------------------------------------------------------
-- Pelanggan boleh melihat gambar miliknya sendiri, Admin boleh melihat semua gambar
CREATE POLICY "Pelanggan lihat gambar pesanan sendiri atau admin"
  ON public.order_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_images.order_id 
      AND (orders.customer_id = auth.uid() OR public.is_admin())
    )
  );

-- Pelanggan boleh mengunggah gambar untuk pesanannya sendiri
CREATE POLICY "Pelanggan tambah gambar untuk pesanannya"
  ON public.order_images FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_images.order_id 
      AND orders.customer_id = auth.uid()
    )
  );

-- ============================================================================
-- 8. STORAGE BUCKET: contoh-gambar (Bukan Publik)
-- ============================================================================
-- Buat bucket privat 'contoh-gambar' di Supabase Storage
INSERT INTO storage.buckets (id, name, public) 
VALUES ('contoh-gambar', 'contoh-gambar', false)
ON CONFLICT (id) DO NOTHING;

-- RLS Storage: Pelanggan boleh upload di folder id dirinya sendiri: {user_id}/{order_id}/{nama_file}
CREATE POLICY "Pelanggan upload ke foldernya sendiri"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'contoh-gambar' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Pelanggan boleh membaca gambar di foldernya sendiri, Admin boleh membaca semua
CREATE POLICY "Pelanggan baca gambar foldernya atau admin baca semua"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'contoh-gambar' 
    AND (
      auth.uid()::text = (storage.foldername(name))[1] 
      OR public.is_admin()
    )
  );

-- ============================================================================
-- CARA MENGANGKAT AKUN MENJADI ADMIN (Sesuai Bagian 8 PRD)
-- Jalankan query berikut di SQL Editor setelah akun terdaftar:
-- UPDATE public.profiles SET role = 'admin' WHERE id = 'UUID_AKUN_ANDA';
-- ============================================================================
