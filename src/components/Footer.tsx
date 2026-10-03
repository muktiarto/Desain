import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                D
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Desain<span className="text-blue-600">Ku</span>
              </span>
            </div>
            <p className="text-sm text-slate-600 max-w-md leading-relaxed">
              Solusi pemesanan jasa desain grafis profesional khusus flyer, brosur, dan spanduk banner. 
              Formulir terstruktur lengkap tanpa perlu bolak-balik chat, dengan pemantauan status transparan.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                Row Level Security (RLS) Ready
              </span>
              <span aria-hidden="true">·</span>
              <span>PostgreSQL & Supabase Auth</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
              Layanan Utama
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>Desain Flyer & Brosur (A5, A4, DL)</li>
              <li>Spanduk Banner & X-Banner (60x160, 3x1 m)</li>
              <li>Katalog & Promosi Usaha Kuliner</li>
              <li>Banner Acara & Pameran Bisnis</li>
            </ul>
          </div>

          {/* PRD Reference & Supabase */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
              Spesifikasi Sistem
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => navigateTo({ name: 'sql_schema' })}
                  className="text-blue-600 hover:text-blue-700 underline text-left cursor-pointer"
                >
                  Lihat Skema SQL Supabase
                </button>
              </li>
              <li className="text-slate-500 text-xs">
                Mencakup trigger profil otomatis, fungsi is_admin(), dan storage RLS bucket contoh-gambar.
              </li>
              <li className="text-slate-500 text-xs pt-1">
                Alur WhatsApp: wa.me direct inquiry
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} DesainKu. Aplikasi Pemesanan Jasa Desain Grafis.</p>
          <div className="flex items-center gap-3">
            <span>Dirancang sesuai PRD MVP</span>
            <span aria-hidden="true">·</span>
            <span>Bahasa Indonesia Sederhana</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
