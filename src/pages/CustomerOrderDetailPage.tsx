import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import { 
  ArrowLeft, 
  MessageSquare, 
  Calendar, 
  DollarSign, 
  FileText, 
  Layers, 
  Image as ImageIcon, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  Info,
  Maximize2,
  X
} from 'lucide-react';

interface CustomerOrderDetailPageProps {
  orderId: string;
}

export const CustomerOrderDetailPage: React.FC<CustomerOrderDetailPageProps> = ({ orderId }) => {
  const { getOrderById, navigateTo } = useApp();
  const order = getOrderById(orderId);
  const [selectedPreviewImg, setSelectedPreviewImg] = useState<string | null>(null);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-xl border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Pesanan Tidak Ditemukan
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Nomor pesanan #{orderId} tidak terdaftar di akun Anda atau telah diubah.
          </p>
          <button
            onClick={() => navigateTo({ name: 'pesanan' })}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            Kembali ke Pesanan Saya
          </button>
        </div>
      </div>
    );
  }

  const formatRupiah = (val?: number | null) => {
    if (val === null || val === undefined) {
      return 'Belum Ditentukan (Menunggu Admin)';
    }
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  // WhatsApp quick link for customer to chat directly with admin
  const whatsappAdminNumber = '6281198765432'; // Nomor Admin DesainKu
  const whatsappMessage = encodeURIComponent(
    `Halo Admin DesainKu, saya ingin menanyakan perkembangan pesanan saya:\n- No. Pesanan: #${order.id}\n- Jenis: ${order.jenis_desain === 'flyer' ? 'Flyer' : 'Banner'} (${order.ukuran})\n- Status saat ini: ${order.status.toUpperCase()}\n\nTerima kasih!`
  );
  const whatsappUrl = `https://wa.me/${whatsappAdminNumber}?text=${whatsappMessage}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {/* Back button & ID */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => navigateTo({ name: 'pesanan' })}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar Pesanan
        </button>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
            ID: #{order.id}
          </span>
          <StatusBadge status={order.status} size="md" />
        </div>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Progress Tracker Banner */}
        <div className="bg-slate-50/70 p-6 border-b border-slate-200">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
            Tahapan Pengerjaan Pesanan
          </h2>

          <div className="grid grid-cols-3 gap-2 relative">
            {/* Step 1: Baru */}
            <div className="text-center relative">
              <div
                className={`w-9 h-9 rounded-full mx-auto flex items-center justify-center text-xs font-bold transition-colors ${
                  order.status === 'baru' || order.status === 'dikerjakan' || order.status === 'selesai'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                1
              </div>
              <p className="text-xs font-semibold text-slate-900 mt-2">Pesanan Baru</p>
              <p className="text-[11px] text-slate-500 hidden sm:block">Diterima oleh sistem</p>
            </div>

            {/* Step 2: Dikerjakan */}
            <div className="text-center relative">
              <div
                className={`w-9 h-9 rounded-full mx-auto flex items-center justify-center text-xs font-bold transition-colors ${
                  order.status === 'dikerjakan' || order.status === 'selesai'
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                2
              </div>
              <p className="text-xs font-semibold text-slate-900 mt-2">Dikerjakan</p>
              <p className="text-[11px] text-slate-500 hidden sm:block">Sedang proses desain</p>
            </div>

            {/* Step 3: Selesai */}
            <div className="text-center relative">
              <div
                className={`w-9 h-9 rounded-full mx-auto flex items-center justify-center text-xs font-bold transition-colors ${
                  order.status === 'selesai'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                3
              </div>
              <p className="text-xs font-semibold text-slate-900 mt-2">Selesai</p>
              <p className="text-[11px] text-slate-500 hidden sm:block">File siap dikirim</p>
            </div>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Price & Deadline Highlight Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-blue-50/60 border border-blue-100">
            <div>
              <span className="text-xs font-medium text-slate-500 block">
                Total Biaya Desain:
              </span>
              <p className="text-lg font-bold text-slate-900 tabular-nums mt-0.5">
                {formatRupiah(order.harga)}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                {order.harga
                  ? 'Harga resmi yang telah diverifikasi oleh admin.'
                  : 'Admin sedang menghitung biaya berdasarkan kompleksitas materi.'}
              </p>
            </div>

            <div>
              <span className="text-xs font-medium text-slate-500 block">
                Estimasi Selesai (Batas Waktu):
              </span>
              <p className="text-lg font-bold text-slate-900 mt-0.5">
                {order.batas_waktu ? formatDate(order.batas_waktu) : 'Menunggu Konfirmasi Admin'}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                {order.batas_waktu
                  ? 'Target waktu selesai pembuatan desain.'
                  : 'Batas waktu akan dicantumkan saat admin mengubah status ke Dikerjakan.'}
              </p>
            </div>
          </div>

          {/* Order Specifications */}
          <div className="space-y-6">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
              Spesifikasi Desain yang Dipesan
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div>
                <span className="text-xs font-medium text-slate-500 block mb-1">
                  Jenis Desain & Media:
                </span>
                <p className="font-semibold text-slate-900 capitalize">
                  {order.jenis_desain === 'flyer' ? 'Flyer / Brosur' : 'Banner / Spanduk'}
                </p>
              </div>

              <div>
                <span className="text-xs font-medium text-slate-500 block mb-1">
                  Ukuran Desain:
                </span>
                <p className="font-semibold text-slate-900">{order.ukuran}</p>
              </div>

              <div>
                <span className="text-xs font-medium text-slate-500 block mb-1">
                  Warna yang Diinginkan:
                </span>
                <p className="text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-medium">
                  {order.warna}
                </p>
              </div>

              <div>
                <span className="text-xs font-medium text-slate-500 block mb-1">
                  Tanggal Pemesanan:
                </span>
                <p className="text-slate-800 font-medium">{formatDate(order.tanggal_pesan)}</p>
              </div>
            </div>

            {/* Teks Materi */}
            <div>
              <span className="text-xs font-medium text-slate-500 block mb-1">
                Teks yang Wajib Ada di Desain:
              </span>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed font-sans">
                {order.teks}
              </div>
            </div>

            {/* Catatan Tambahan */}
            {order.catatan && (
              <div>
                <span className="text-xs font-medium text-slate-500 block mb-1">
                  Catatan Tambahan Pelanggan:
                </span>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed italic">
                  "{order.catatan}"
                </div>
              </div>
            )}

            {/* Attached Reference Images */}
            <div>
              <span className="text-xs font-medium text-slate-500 block mb-2">
                Contoh Gambar & Referensi ({order.images?.length || 0}):
              </span>

              {order.images && order.images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {order.images.map((img) => (
                    <div
                      key={img.id}
                      onClick={() => setSelectedPreviewImg(img.file_url)}
                      className="group relative rounded-xl border border-slate-200 overflow-hidden bg-slate-100 aspect-square cursor-pointer hover:border-blue-400 transition-colors"
                    >
                      <img
                        src={img.file_url}
                        alt={img.file_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
                        <Maximize2 className="w-4 h-4 mr-1" />
                        Perbesar
                      </div>
                      <div className="absolute bottom-0 inset-x-0 bg-slate-900/70 p-1 text-[10px] text-white truncate px-2">
                        {img.file_name}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  Tidak ada gambar contoh referensi yang dilampirkan.
                </p>
              )}
            </div>
          </div>

          {/* Action to chat admin via WhatsApp */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Perlu konfirmasi cepat atau ada revisi materi? Hubungi admin via WhatsApp.
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              Tanya Admin via WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Image zoom modal */}
      {selectedPreviewImg && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedPreviewImg(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh] bg-white rounded-xl overflow-hidden p-2 shadow-2xl">
            <button
              onClick={() => setSelectedPreviewImg(null)}
              className="absolute top-3 right-3 p-1.5 bg-slate-900/80 text-white rounded-full hover:bg-slate-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selectedPreviewImg}
              alt="Preview Referensi Desain"
              className="max-h-[80vh] w-auto mx-auto object-contain rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
};
