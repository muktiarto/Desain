export type UserRole = 'customer' | 'admin';

export type OrderStatus = 'baru' | 'dikerjakan' | 'selesai';

export type DesignType = 'flyer' | 'banner';

export interface Profile {
  id: string;
  nama: string;
  no_whatsapp: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface OrderImage {
  id: string;
  order_id: string;
  file_name: string;
  file_url: string; // Base64 data URL or asset URL
  file_size?: number;
  created_at: string;
}

export interface Order {
  id: string;
  customer_id: string;
  customer_nama?: string;
  customer_whatsapp?: string;
  customer_email?: string;
  jenis_desain: DesignType;
  ukuran: string;
  teks: string;
  warna: string;
  catatan?: string;
  status: OrderStatus;
  harga?: number | null; // dalam Rupiah
  batas_waktu?: string | null; // YYYY-MM-DD
  tanggal_pesan: string; // ISO string
  updated_at: string; // ISO string
  images: OrderImage[];
}

export type PageRoute = 
  | { name: 'home' }
  | { name: 'login' }
  | { name: 'daftar' }
  | { name: 'pesanan' }
  | { name: 'pesanan_baru' }
  | { name: 'pesanan_detail'; orderId: string }
  | { name: 'admin' }
  | { name: 'admin_pesanan_detail'; orderId: string }
  | { name: 'sql_schema' };
