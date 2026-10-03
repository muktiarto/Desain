import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  FileCheck, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  Send,
  SlidersHorizontal
} from 'lucide-react';
import heroImage from '../assets/images/hero_design_showcase_1791014493823.jpg';
import sampleImage from '../assets/images/flyer_banner_samples_1791014508836.jpg';

export const HomePage: React.FC = () => {
  const { currentUser, navigateTo } = useApp();

  const handleOrderCTA = () => {
    if (!currentUser) {
      navigateTo({ name: 'login' });
    } else if (currentUser.role === 'admin') {
      navigateTo({ name: 'admin' });
    } else {
      navigateTo({ name: 'pesanan_baru' });
    }
  };

  const handleViewOrdersCTA = () => {
    if (!currentUser) {
      navigateTo({ name: 'login' });
    } else if (currentUser.role === 'admin') {
      navigateTo({ name: 'admin' });
    } else {
      navigateTo({ name: 'pesanan' });
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-16 pb-12 bg-gradient-to-b from-blue-50/50 to-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 border border-blue-200 text-blue-800 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Pemesanan Desain Grafis Terstruktur & Cepat</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Pesan Desain Flyer & Banner <br className="hidden sm:inline" />
                <span className="text-blue-600">Tanpa Bolak-Balik Chat</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Tuliskan ukuran, teks, dan warna yang Anda inginkan di formulir lengkap sejak awal. 
                Pantau proses pengerjaan langsung tanpa harus terus-menerus bertanya lewat chat.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={handleOrderCTA}
                  className="px-6 py-3.5 text-sm sm:text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  {currentUser?.role === 'admin' ? 'Buka Panel Pesanan Admin' : 'Buat Pesanan Baru Sekarang'}
                </button>

                <button
                  onClick={handleViewOrdersCTA}
                  className="px-6 py-3.5 text-sm sm:text-base font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  {currentUser?.role === 'admin' ? 'Lihat Semua Pesanan' : 'Pantau Pesanan Saya'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Feature bullet summary */}
              <div className="pt-4 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Formulir detail & rapi</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Batas waktu & harga jelas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Status terupdate berkala</span>
                </div>
              </div>
            </div>

            {/* Right Media (5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 bg-slate-100 aspect-16/10 lg:aspect-4/3">
                <img
                  src={heroImage}
                  alt="Katalog dan mockup hasil desain flyer dan spanduk DesainKu"
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent flex items-end p-5">
                  <div className="text-white">
                    <p className="text-xs font-semibold tracking-wide uppercase text-blue-200">
                      Standar Kualitas DesainKu
                    </p>
                    <p className="text-sm font-medium mt-0.5">
                      Siap cetak & siap posting di media sosial dan WhatsApp
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2 Main Service Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Fokus Spesialisasi
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Dua Layanan Utama yang Dikerjakan Rapi
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Kami berfokus pada dua media promosi fisik dan digital yang paling banyak dibutuhkan usaha Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Service 1: Flyer */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between hover:border-blue-300 transition-colors shadow-2xs">
            <div>
              <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Desain Flyer & Brosur</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Cocok untuk promosi menu resto/cafe, brosur seminar, voucher diskon, selebaran event, atau katalog produk toko.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 mb-6">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  <span>Pilihan ukuran: A5, A4, Flyer DL (10x21 cm), atau ukuran khusus</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  <span>Layout hirarki tipografi jelas agar pesan promo langsung terbaca</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  <span>Resolusi 300 DPI siap cetak offset/digital + file PDF/JPG</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => {
                if (!currentUser) navigateTo({ name: 'login' });
                else navigateTo({ name: 'pesanan_baru' });
              }}
              className="w-full py-2.5 px-4 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-center cursor-pointer"
            >
              Pesan Desain Flyer Sekarang →
            </button>
          </div>

          {/* Service 2: Banner / Spanduk */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between hover:border-blue-300 transition-colors shadow-2xs">
            <div>
              <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-5">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Desain Spanduk & Banner</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Untuk papan plang toko, roll-up banner standing booth pameran, spanduk kain/flexi outdoor, hingga backdrop panggung.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 mb-6">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                  <span>Pilihan ukuran: Roll-up 60x160 cm, Spanduk 100x200 cm, 300x100 cm, custom</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                  <span>Dibuat kontras tinggi agar terbaca jelas dari jarak jauh pengunjung</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                  <span>Format CMYK siap kirim langsung ke percetakan spanduk</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => {
                if (!currentUser) navigateTo({ name: 'login' });
                else navigateTo({ name: 'pesanan_baru' });
              }}
              className="w-full py-2.5 px-4 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors text-center cursor-pointer"
            >
              Pesan Desain Banner Sekarang →
            </button>
          </div>
        </div>
      </section>

      {/* 3 Step Workflow */}
      <section className="bg-slate-100/60 py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Alur Pemesanan Sederhana
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              Hanya 3 Langkah Mudah
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Semua detail tercatat rapi di sistem sehingga tidak ada informasi yang terlewat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-blue-600 block mb-2">Langkah 01</span>
              <h4 className="text-base font-semibold text-slate-900 mb-1">
                Isi Formulir Lengkap
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pilih jenis desain, cantumkan ukuran, teks promo, warna yang disukai, dan lampirkan contoh gambar jika ada.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-blue-600 block mb-2">Langkah 02</span>
              <h4 className="text-base font-semibold text-slate-900 mb-1">
                Admin Menentukan Harga & Estimasi
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Admin memeriksa detail pesanan Anda, mengisi harga resmi dan batas waktu selesai, lalu mulai mengerjakan desain.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-blue-600 block mb-2">Langkah 03</span>
              <h4 className="text-base font-semibold text-slate-900 mb-1">
                Pantau Status & Terima Hasil
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Buka menu Pesanan Saya kapan saja untuk memantau status (Baru → Dikerjakan → Selesai) secara transparan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Product Gallery / Mockup */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-2xl overflow-hidden text-white grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 p-8 sm:p-12 space-y-4">
            <span className="text-xs uppercase tracking-wider text-blue-400 font-semibold">
              Kerapian & Kepastian Waktu
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold">
              Solusi Tepat untuk Pemilik Usaha, Event Organizer, dan UMKM
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Tidak perlu lagi pusing mencari chat lama yang tenggelam. Semua pesanan, catatan revisi, batas waktu penyelesaian, dan nomor WhatsApp tersimpan aman di satu tempat.
            </p>
            <div className="pt-2">
              <button
                onClick={handleOrderCTA}
                className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Mulai Buat Pesanan Baru →
              </button>
            </div>
          </div>
          <div className="lg:col-span-5 h-full min-h-[260px] relative">
            <img
              src={sampleImage}
              alt="Contoh hasil cetak flyer dan standing banner"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
