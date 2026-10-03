import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Database, Copy, Check, ArrowLeft, Shield, Key } from 'lucide-react';

export const DatabaseSchemaPage: React.FC = () => {
  const { navigateTo } = useApp();
  const [copied, setCopied] = useState(false);

  const sqlCode = `-- ============================================================================
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

-- 4. TABEL ORDER_IMAGES (Contoh gambar referensi)
CREATE TABLE IF NOT EXISTS public.order_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. FUNCTION & TRIGGER: Auto-create Profile saat User Baru Sign Up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, nama, no_whatsapp, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'nama', 'Pengguna Baru'),
    COALESCE(new.raw_user_meta_data->>'no_whatsapp', '-'),
    'customer'
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

-- Kebijakan RLS: PROFILES
CREATE POLICY "Pengguna lihat profil sendiri atau admin lihat semua"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Pengguna ubah profil sendiri non-role"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
  );

-- Kebijakan RLS: ORDERS
CREATE POLICY "Pelanggan lihat pesanan sendiri dan Admin lihat semua"
  ON public.orders FOR SELECT
  USING (customer_id = auth.uid() OR public.is_admin());

CREATE POLICY "Pelanggan buat pesanan baru miliknya"
  ON public.orders FOR INSERT
  WITH CHECK (
    customer_id = auth.uid() 
    AND status = 'baru'
  );

CREATE POLICY "Admin dapat mengubah pesanan"
  ON public.orders FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Kebijakan RLS: ORDER_IMAGES
CREATE POLICY "Pelanggan lihat gambar pesanan sendiri atau admin"
  ON public.order_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_images.order_id 
      AND (orders.customer_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "Pelanggan tambah gambar untuk pesanannya"
  ON public.order_images FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_images.order_id 
      AND orders.customer_id = auth.uid()
    )
  );

-- 8. STORAGE BUCKET: contoh-gambar (Bukan Publik)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('contoh-gambar', 'contoh-gambar', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Pelanggan upload ke foldernya sendiri"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'contoh-gambar' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Pelanggan baca gambar foldernya atau admin baca semua"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'contoh-gambar' 
    AND (
      auth.uid()::text = (storage.foldername(name))[1] 
      OR public.is_admin()
    )
  );`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigateTo({ name: 'home' })}
          className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </button>

        <button
          onClick={copyToClipboard}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Tersalin ke Clipboard!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Salin Seluruh SQL (supabase/schema.sql)
            </>
          )}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Skema Database & Keamanan Supabase (Tahap 2 PRD)
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              File ini tersimpan di <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono text-slate-800">/supabase/schema.sql</code>. 
              Siap disalin langsung ke SQL Editor di dashboard Supabase milik pemilik usaha.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="font-semibold text-slate-800 block mb-1">1. Tiga Tabel Utama</span>
            <p className="text-slate-600">
              <code className="text-blue-600">profiles</code>, <code className="text-blue-600">orders</code>, dan <code className="text-blue-600">order_images</code> dengan foreign key terintegrasi.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="font-semibold text-slate-800 block mb-1">2. RLS Wajib Aktif</span>
            <p className="text-slate-600">
              Pelanggan hanya bisa melihat & membuat pesanan miliknya. Admin berhak melihat semua & mengubah status/harga.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="font-semibold text-slate-800 block mb-1">3. Trigger & Storage</span>
            <p className="text-slate-600">
              Trigger otomatis saat mendaftar, trigger <code className="text-blue-600">updated_at</code>, dan bucket privat <code className="text-blue-600">contoh-gambar</code>.
            </p>
          </div>
        </div>
      </div>

      {/* SQL code block */}
      <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-md">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="text-xs font-mono text-slate-300 ml-2">supabase/schema.sql</span>
          </div>
          <span className="text-xs text-slate-400">PostgreSQL / Supabase RLS</span>
        </div>

        <pre className="p-4 sm:p-6 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed max-h-[600px] overflow-y-auto">
          {sqlCode}
        </pre>
      </div>

      <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-3">
        <Key className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold mb-1">Petunjuk Pengangkatan Admin (Sesuai Bagian 8 PRD):</p>
          <p className="leading-relaxed">
            Daftar akun baru lewat formulir aplikasi, lalu jalankan query berikut di SQL Editor Supabase untuk mengubah role menjadi admin:<br />
            <code className="bg-white/80 px-2 py-0.5 rounded font-mono text-blue-800 text-[11px] mt-1 inline-block">
              UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@desainku.id';
            </code>
          </p>
        </div>
      </div>
    </div>
  );
};
