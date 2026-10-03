import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LogIn, ArrowRight, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, navigateTo, profiles } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Mohon isi email dan kata sandi.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = login(email, password);
      setLoading(false);
      if (!res.success) {
        setErrorMsg(res.message || 'Gagal masuk. Periksa kembali email Anda.');
      }
    }, 300);
  };

  const handleQuickDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    login(demoEmail, 'password123');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Masuk ke DesainKu</h1>
          <p className="text-xs text-slate-500 mt-1">
            Gunakan akun pelanggan atau admin Anda untuk melanjutkan.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alamat Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="budi@example.com atau admin@desainku.id"
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Kata Sandi
              </label>
              <span className="text-[11px] text-slate-400">Minimal 6 karakter</span>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 shadow-sm"
            >
              {loading ? 'Memproses...' : 'Masuk Sekarang'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Demo Fast Login Helper */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-700 mb-2">
            Masuk Cepat dengan Akun Contoh:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('budi@example.com')}
              className="p-2 text-xs text-left rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1.5 font-medium text-slate-800">
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Budi (Pelanggan)</span>
              </div>
              <span className="text-[10px] text-slate-400 block truncate">budi@example.com</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin@desainku.id')}
              className="p-2 text-xs text-left rounded-lg border border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1.5 font-medium text-blue-900">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Admin Pemilik</span>
              </div>
              <span className="text-[10px] text-blue-600 block truncate">admin@desainku.id</span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500">
          Belum memiliki akun?{' '}
          <button
            onClick={() => navigateTo({ name: 'daftar' })}
            className="text-blue-600 hover:underline font-semibold cursor-pointer"
          >
            Daftar baru di sini
          </button>
        </div>
      </div>
    </div>
  );
};
