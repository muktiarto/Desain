import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import { OrderStatus } from '../types';
import { 
  ArrowLeft, 
  MessageSquare, 
  Save, 
  CheckCircle2, 
  Calendar, 
  DollarSign, 
  Layers, 
  User, 
  Phone, 
  Mail, 
  AlertCircle,
  Clock,
  Maximize2,
  X
} from 'lucide-react';

interface AdminOrderDetailPageProps {
  orderId: string;
}

export const AdminOrderDetailPage: React.FC<AdminOrderDetailPageProps> = ({ orderId }) => {
  const { getOrderById, updateOrderAdmin, navigateTo } = useApp();
  const order = getOrderById(orderId);

  const [status, setStatus] = useState<OrderStatus>('baru');
  const [harga, setHarga] = useState<string>('');
  const [batasWaktu, setBatasWaktu] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedPreviewImg, setSelectedPreviewImg] = useState<string | null>(null);

  useEffect(() => {
    if (order) {
      setStatus(order.status);
      setHarga(order.harga !== null && order.harga !== undefined ? order.harga.toString() : '');
      setBatasWaktu(order.batas_waktu || '');
    }
  }, [order]);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-xl border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Pesanan Tidak Ditemukan
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Pesanan #{orderId} tidak ada di database.
          </p>
          <button
            onClick={() => navigateTo({ name: 'admin' })}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            Kembali ke Panel Admin
          </button>
        </div>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSaveSuccess(false);

    const parsedHarga = harga.trim() ? parseInt(harga.replace(/\D/g, ''), 10) : null;
    const finalBatasWaktu = batasWaktu.trim() || null;

    const result = updateOrderAdmin(order.id, {
      status,
      harga: parsedHarga,
      batas_waktu: finalBatasWaktu,
    });

    if (result.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } else {
      setErrorMsg(result.message || 'Gagal menyimpan pembaruan.');
    }
  };

  const getCleanWa = (waNumber?: string) => {
    if (!waNumber) return '';
    let cleaned = waNumber.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.substring(1);
    }
    return cleaned;
  };

  const cleanWa = getCleanWa(order.customer_whatsapp);
  const waText = encodeURIComponent(
    `Halo Kak ${order.customer_nama}, dari Admin DesainKu. Mengonfirmasi pesanan #${order.id} (${order.jenis_desain === 'flyer' ? 'Flyer' : 'Banner'}). Status saat ini: ${status.toUpperCase()}.`
  );
  const waUrl = `https://wa.me/${cleanWa}?text=${waText}`;

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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {/* Top Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => navigateTo({ name: 'admin' })}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Semua Pesanan
        </button>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
            #{order.id}
          </span>
          <StatusBadge status={order.status} size="md" />
        </div>
      </div>

      {saveSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-medium">
              Perubahan pesanan #{order.id} berhasil disimpan! Status, harga, dan batas waktu telah diperbarui.
            </span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">Tersimpan</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Customer details & design specs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Informasi Pelanggan
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Nama:</span>
                  <span className="font-semibold text-slate-800">{order.customer_nama || 'Pelanggan'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">WhatsApp:</span>
                  <span className="font-mono text-slate-800 font-medium">
                    {order.customer_whatsapp || '-'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:col-span-2 pt-2 border-t border-slate-100">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Email:</span>
                  <span className="text-slate-800">{order.customer_email || '-'}</span>
                </div>
              </div>
            </div>

            {cleanWa && (
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Hubungi pelanggan untuk konfirmasi atau kirim preview file:
                </span>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-2xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Chat WhatsApp
                </a>
              </div>
            )}
          </div>

          {/* Design Specs Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100">
              Spesifikasi Desain dari Pelanggan
            </h2>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Jenis Desain:</span>
                <span className="font-semibold text-slate-900 capitalize text-sm">
                  {order.jenis_desain === 'flyer' ? 'Flyer / Brosur' : 'Banner / Spanduk'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Ukuran:</span>
                <span className="font-semibold text-slate-900 text-sm">{order.ukuran}</span>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-400 block mb-1">Warna yang Diinginkan:</span>
              <p className="text-xs font-medium text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {order.warna}
              </p>
            </div>

            <div>
              <span className="text-xs text-slate-400 block mb-1">
                Teks yang Wajib Ada di Desain:
              </span>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                {order.teks}
              </div>
            </div>

            {order.catatan && (
              <div>
                <span className="text-xs text-slate-400 block mb-1">Catatan Tambahan:</span>
                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                  "{order.catatan}"
                </p>
              </div>
            )}

            {/* Images */}
            <div>
              <span className="text-xs text-slate-400 block mb-2">
                Contoh Gambar & Referensi Layout ({order.images?.length || 0}):
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
                  Pelanggan tidak melampirkan file referensi gambar.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Manage Form (5 cols) */}
        <div className="lg:col-span-5 sticky top-20">
          <div className="bg-white rounded-xl border border-blue-200 p-6 shadow-sm">
            <div className="pb-4 mb-5 border-b border-slate-100">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">
                Formulir Kelola Pesanan
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                Update Status, Harga & Batas Waktu
              </h2>
              <p className="text-[11px] text-slate-500 mt-1">
                Perubahan akan langsung terlihat di akun pelanggan.
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              {/* 1. Status Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Status Pengerjaan Pesanan
                </label>
                <div className="space-y-2">
                  <label
                    onClick={() => setStatus('baru')}
                    className={`flex items-center justify-between p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                      status === 'baru'
                        ? 'border-blue-600 bg-blue-50/50 font-semibold text-blue-900'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                      <span>Baru (Pesanan Diterima)</span>
                    </div>
                    <input
                      type="radio"
                      name="status"
                      checked={status === 'baru'}
                      onChange={() => {}}
                      className="text-blue-600"
                    />
                  </label>

                  <label
                    onClick={() => setStatus('dikerjakan')}
                    className={`flex items-center justify-between p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                      status === 'dikerjakan'
                        ? 'border-amber-500 bg-amber-50/50 font-semibold text-amber-900'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span>Dikerjakan (Sedang Proses Desain)</span>
                    </div>
                    <input
                      type="radio"
                      name="status"
                      checked={status === 'dikerjakan'}
                      onChange={() => {}}
                      className="text-amber-600"
                    />
                  </label>

                  <label
                    onClick={() => setStatus('selesai')}
                    className={`flex items-center justify-between p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                      status === 'selesai'
                        ? 'border-emerald-600 bg-emerald-50/50 font-semibold text-emerald-900'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                      <span>Selesai (Desain Rampung & Dikirim)</span>
                    </div>
                    <input
                      type="radio"
                      name="status"
                      checked={status === 'selesai'}
                      onChange={() => {}}
                      className="text-emerald-600"
                    />
                  </label>
                </div>
              </div>

              {/* 2. Harga (dalam Rupiah) */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Harga Desain (Rupiah)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500">
                    Rp
                  </span>
                  <input
                    type="number"
                    value={harga}
                    onChange={(e) => setHarga(e.target.value)}
                    placeholder="Contoh: 150000"
                    min="0"
                    step="1000"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
                <div className="flex gap-1.5 mt-2">
                  <span className="text-[10px] text-slate-400 self-center">Pilihan cepat:</span>
                  {[75000, 100000, 150000, 200000].map((quick) => (
                    <button
                      type="button"
                      key={quick}
                      onClick={() => setHarga(quick.toString())}
                      className="px-2 py-0.5 text-[10px] rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                    >
                      {quick / 1000}rb
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Batas Waktu Selesai */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Batas Waktu Selesai (Target Deadline)
                </label>
                <input
                  type="date"
                  value={batasWaktu}
                  onChange={(e) => setBatasWaktu(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Pelanggan akan melihat tanggal ini di halaman rincian pesanan miliknya.
                </p>
              </div>

              {/* Save Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Simpan Perubahan Pesanan
                </button>
              </div>
            </form>
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
