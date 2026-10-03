import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  Upload, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  Image as ImageIcon,
  Send,
  Info
} from 'lucide-react';

export const NewOrderPage: React.FC = () => {
  const { createOrder, navigateTo } = useApp();

  const [jenisDesain, setJenisDesain] = useState<'flyer' | 'banner'>('flyer');
  const [ukuranPreset, setUkuranPreset] = useState<string>('A5 (14.8 x 21 cm)');
  const [ukuranCustom, setUkuranCustom] = useState<string>('');
  const [teks, setTeks] = useState<string>('');
  const [warna, setWarna] = useState<string>('');
  const [catatan, setCatatan] = useState<string>('');
  
  // Image attachments state
  const [uploadedImages, setUploadedImages] = useState<
    { file_name: string; file_url: string; file_size: number }[]
  >([]);
  
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);

  const flyerPresets = [
    'A5 (14.8 x 21 cm)',
    'A4 (21 x 29.7 cm)',
    'Flyer DL (10 x 21 cm)',
    'Ukuran Custom / Lainnya',
  ];

  const bannerPresets = [
    'Roll-Up Banner 60x160 cm',
    'X-Banner 60x160 cm',
    'Spanduk Outdoor 100x200 cm',
    'Spanduk Outdoor 300x100 cm',
    'Ukuran Custom / Lainnya',
  ];

  // File upload handler with 5MB & image type validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg('');
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (uploadedImages.length + files.length > 5) {
      setErrorMsg('Maksimal 5 gambar contoh per pesanan sesuai batas sistem.');
      return;
    }

    const newItems: { file_name: string; file_url: string; file_size: number }[] = [];

    Array.from(files).forEach((file) => {
      // Validate type
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Format file harus berupa gambar (JPG, PNG, atau WebP).');
        return;
      }

      // Validate size 5MB max
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg(`File ${file.name} melebihi batas ukuran maksimal 5 MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImages((prev) => [
            ...prev,
            {
              file_name: file.name,
              file_url: event.target!.result as string,
              file_size: file.size,
            },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validasi sesuai PRD
    if (!teks.trim()) {
      setErrorMsg('Kolom teks materi desain wajib diisi.');
      return;
    }

    if (!warna.trim()) {
      setErrorMsg('Kolom warna yang diinginkan wajib diisi.');
      return;
    }

    const finalUkuran = ukuranPreset === 'Ukuran Custom / Lainnya'
      ? ukuranCustom.trim()
      : ukuranPreset;

    if (!finalUkuran) {
      setErrorMsg('Mohon tentukan ukuran desain yang diinginkan.');
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      const res = createOrder({
        jenis_desain: jenisDesain,
        ukuran: finalUkuran,
        teks: teks.trim(),
        warna: warna.trim(),
        catatan: catatan.trim() || undefined,
        images: uploadedImages,
      });

      setSubmitting(false);

      if (res.success && res.orderId) {
        setSuccessOrderId(res.orderId);
      } else {
        setErrorMsg(res.message || 'Gagal mengirim pesanan. Silakan periksa kembali formulir.');
      }
    }, 400);
  };

  if (successOrderId) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Pesanan Berhasil Terkirim!
          </h2>
          <p className="text-sm text-slate-600 mb-4 leading-relaxed">
            Pesanan Anda dengan nomor ID{' '}
            <span className="font-mono font-bold text-blue-600">#{successOrderId}</span>{' '}
            telah tersimpan dengan status <span className="font-semibold text-blue-700">Baru</span>.
          </p>
          <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg mb-6 border border-slate-100">
            Pemilik usaha (Admin) akan segera memeriksa detail materi Anda untuk menentukan harga resmi dan batas waktu selesai pengerjaan.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigateTo({ name: 'pesanan_detail', orderId: successOrderId })}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
            >
              Lihat Detail Pesanan Ini
            </button>
            <button
              onClick={() => navigateTo({ name: 'pesanan' })}
              className="px-5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Kembali ke Pesanan Saya
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={() => navigateTo({ name: 'pesanan' })}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Pesanan Saya
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        {/* Title */}
        <div className="pb-6 mb-6 border-b border-slate-100">
          <h1 className="text-2xl font-bold text-slate-900">
            Formulir Pesanan Desain Baru
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
            Isi semua spesifikasi yang Anda butuhkan di bawah ini agar kami dapat langsung mengeksekusi desain tanpa perlu bolak-balik bertanya.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Jenis Desain */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-2">
              1. Jenis Desain <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                onClick={() => {
                  setJenisDesain('flyer');
                  setUkuranPreset('A5 (14.8 x 21 cm)');
                }}
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  jenisDesain === 'flyer'
                    ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="jenis_desain"
                  checked={jenisDesain === 'flyer'}
                  onChange={() => {}}
                  className="mt-0.5 text-blue-600"
                />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Flyer / Brosur</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Selebaran promosi, menu kafe, pamflet event, dsb.
                  </p>
                </div>
              </label>

              <label
                onClick={() => {
                  setJenisDesain('banner');
                  setUkuranPreset('Roll-Up Banner 60x160 cm');
                }}
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  jenisDesain === 'banner'
                    ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="jenis_desain"
                  checked={jenisDesain === 'banner'}
                  onChange={() => {}}
                  className="mt-0.5 text-blue-600"
                />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Banner / Spanduk</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Spanduk outdoor flexi, roll-up banner booth, baliho, dsb.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* 2. Ukuran Desain */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              2. Ukuran Desain <span className="text-red-500">*</span>
            </label>
            <p className="text-[11px] text-slate-500 mb-2">
              Pilih dari format standar atau masukkan ukuran khusus Anda.
            </p>

            <select
              value={ukuranPreset}
              onChange={(e) => setUkuranPreset(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
            >
              {(jenisDesain === 'flyer' ? flyerPresets : bannerPresets).map((preset) => (
                <option key={preset} value={preset}>
                  {preset}
                </option>
              ))}
            </select>

            {ukuranPreset === 'Ukuran Custom / Lainnya' && (
              <div className="mt-3">
                <input
                  type="text"
                  value={ukuranCustom}
                  onChange={(e) => setUkuranCustom(e.target.value)}
                  placeholder="Ketik ukuran khusus (misal: 250 x 80 cm, atau 1080x1920 px)"
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            )}
          </div>

          {/* 3. Teks yang Harus Ada */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-800">
                3. Teks yang Wajib Ada di Desain <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">Judul, subjudul, promo, kontak</span>
            </div>
            <textarea
              rows={5}
              value={teks}
              onChange={(e) => setTeks(e.target.value)}
              placeholder="Contoh:&#10;GRAND OPENING KEDAI KOPI NIKMAT&#10;Diskon 50% Semua Minuman (1-5 Oktober)&#10;Alamat: Jl. Sudirman No. 10&#10;Info & Reservasi: WA 0812-xxxx-xxxx / IG @kedaikopi"
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-sans leading-relaxed"
            />
          </div>

          {/* 4. Warna yang Diinginkan */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              4. Warna yang Diinginkan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={warna}
              onChange={(e) => setWarna(e.target.value)}
              placeholder="Contoh: Nuansa Biru Navy dan Emas mewah, atau Earth Tone hangat"
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[11px] text-slate-400 self-center mr-1">Rekomendasi cepat:</span>
              {['Biru & Putih Elegan', 'Merah & Kuning Promo', 'Hijau Emerald & Emas', 'Hitam & Gold Minimalis'].map((rec) => (
                <button
                  type="button"
                  key={rec}
                  onClick={() => setWarna(rec)}
                  className="px-2 py-0.5 text-[11px] rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  {rec}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Catatan Tambahan (Boleh kosong) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-800">
                5. Catatan Tambahan
              </label>
              <span className="text-[11px] text-slate-400">Boleh dikosongkan</span>
            </div>
            <textarea
              rows={3}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Contoh: Tolong beri ruang kosong di pojok kanan bawah untuk stiker QR Code, atau gaya font formal elegan."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          {/* 6. Upload Contoh Gambar (Maks 5 gambar, 5MB per file) */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-800">
                6. Upload Contoh Gambar / Referensi Layout
              </label>
              <span className="text-[11px] text-slate-400">
                Maks 5 gambar (JPG, PNG, WebP) · Maks 5 MB/file
              </span>
            </div>

            {/* Dropzone container */}
            <label className="mt-1 border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-blue-50/20">
              <Upload className="w-8 h-8 text-blue-600 mb-2" />
              <p className="text-xs font-medium text-slate-700">
                Klik atau seret file gambar referensi ke sini
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Contoh: foto produk, logo usaha, sketsa corat-coret, atau desain referensi yang Anda sukai
              </p>
              <input
                type="file"
                multiple
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
                className="hidden"
                disabled={uploadedImages.length >= 5}
              />
            </label>

            {/* Uploaded previews */}
            {uploadedImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
                {uploadedImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative rounded-lg border border-slate-200 overflow-hidden bg-white shadow-2xs group aspect-square"
                  >
                    <img
                      src={img.file_url}
                      alt={img.file_name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-sm transition-colors cursor-pointer"
                      title="Hapus gambar"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="absolute bottom-0 inset-x-0 bg-slate-900/70 p-1 text-[10px] text-white truncate px-1.5">
                      {img.file_name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Status pesanan akan langsung otomatis menjadi <strong>Baru</strong>.</span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-7 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {submitting ? (
                'Mengirim Pesanan...'
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Kirim Pesanan Sekarang
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
