import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  PlusCircle, 
  LayoutDashboard, 
  Database, 
  LogOut, 
  User, 
  Menu, 
  X,
  ChevronDown,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, currentRoute, navigateTo, logout, switchDemoUser, profiles } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (routeName: string) => currentRoute.name === routeName;

  const handleNav = (route: any) => {
    navigateTo(route);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      {/* Demo Switcher Quick Banner for Owner / Tester */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-medium text-white">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Mode Simulasi MVP:
            </span>
            <span className="text-slate-400 hidden sm:inline">
              Beralih peran pelanggan & admin untuk menguji alur:
            </span>
          </div>

          <div className="flex items-center gap-2">
            {profiles.map((p) => {
              const isCurrent = currentUser?.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => switchDemoUser(p.id)}
                  className={`px-2.5 py-0.5 rounded text-xs transition-colors whitespace-nowrap ${
                    isCurrent
                      ? p.role === 'admin'
                        ? 'bg-blue-600 text-white font-medium'
                        : 'bg-white text-slate-950 font-medium'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {p.role === 'admin' ? '🛡️ Admin' : `👤 ${p.nama.split(' ')[0]}`}
                </button>
              );
            })}
            <button
              onClick={() => handleNav({ name: 'sql_schema' })}
              className="text-xs text-blue-300 hover:text-white underline ml-1 cursor-pointer"
            >
              SQL Supabase
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center">
            <button
              onClick={() => handleNav({ name: 'home' })}
              className="flex items-center gap-2.5 text-left focus:outline-none cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                D
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Desain<span className="text-blue-600">Ku</span>
              </span>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            <button
              onClick={() => handleNav({ name: 'home' })}
              className={`transition-colors cursor-pointer ${
                isActive('home') ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Beranda
            </button>

            {currentUser?.role === 'customer' && (
              <>
                <button
                  onClick={() => handleNav({ name: 'pesanan' })}
                  className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isActive('pesanan') ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Pesanan Saya
                </button>
                <button
                  onClick={() => handleNav({ name: 'pesanan_baru' })}
                  className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isActive('pesanan_baru') ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  Buat Pesanan Baru
                </button>
              </>
            )}

            {currentUser?.role === 'admin' && (
              <button
                onClick={() => handleNav({ name: 'admin' })}
                className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isActive('admin') ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Semua Pesanan (Admin)
              </button>
            )}

            <button
              onClick={() => handleNav({ name: 'sql_schema' })}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                isActive('sql_schema') ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Database className="w-4 h-4" />
              Skema Supabase
            </button>
          </nav>

          {/* Zone 3: Primary Actions & User Profile */}
          <div className="hidden md:flex items-center gap-4">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-left cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 text-xs font-semibold border border-slate-200">
                    {currentUser.role === 'admin' ? (
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                    ) : (
                      currentUser.nama.charAt(0)
                    )}
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-slate-800 leading-tight truncate max-w-[130px]">
                      {currentUser.nama}
                    </p>
                    <p className="text-slate-500 capitalize">
                      {currentUser.role === 'admin' ? 'Pemilik (Admin)' : 'Pelanggan'}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50 text-sm">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-500">Masuk sebagai:</p>
                      <p className="font-medium text-slate-900 truncate">{currentUser.email}</p>
                      <p className="text-xs text-slate-500">WA: {currentUser.no_whatsapp}</p>
                    </div>

                    {currentUser.role === 'customer' ? (
                      <>
                        <button
                          onClick={() => handleNav({ name: 'pesanan' })}
                          className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer"
                        >
                          <FileText className="w-4 h-4 text-slate-500" />
                          Pesanan Saya
                        </button>
                        <button
                          onClick={() => handleNav({ name: 'pesanan_baru' })}
                          className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer"
                        >
                          <PlusCircle className="w-4 h-4 text-slate-500" />
                          Buat Pesanan Baru
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleNav({ name: 'admin' })}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-500" />
                        Dashboard Pesanan Masuk
                      </button>
                    )}

                    <div className="border-t border-slate-100 mt-1">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Keluar (Logout)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleNav({ name: 'login' })}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 cursor-pointer"
                >
                  Masuk
                </button>
                <button
                  onClick={() => handleNav({ name: 'daftar' })}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Daftar
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-md"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-5 space-y-3">
          <nav className="flex flex-col space-y-2">
            <button
              onClick={() => handleNav({ name: 'home' })}
              className={`text-left py-2 px-3 rounded-md text-sm font-medium ${
                isActive('home') ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Beranda
            </button>

            {currentUser?.role === 'customer' && (
              <>
                <button
                  onClick={() => handleNav({ name: 'pesanan' })}
                  className={`text-left py-2 px-3 rounded-md text-sm font-medium flex items-center gap-2 ${
                    isActive('pesanan') ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Pesanan Saya
                </button>
                <button
                  onClick={() => handleNav({ name: 'pesanan_baru' })}
                  className={`text-left py-2 px-3 rounded-md text-sm font-medium flex items-center gap-2 ${
                    isActive('pesanan_baru') ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  Buat Pesanan Baru
                </button>
              </>
            )}

            {currentUser?.role === 'admin' && (
              <button
                onClick={() => handleNav({ name: 'admin' })}
                className={`text-left py-2 px-3 rounded-md text-sm font-medium flex items-center gap-2 ${
                  isActive('admin') ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Semua Pesanan (Admin)
              </button>
            )}

            <button
              onClick={() => handleNav({ name: 'sql_schema' })}
              className={`text-left py-2 px-3 rounded-md text-sm font-medium flex items-center gap-2 ${
                isActive('sql_schema') ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Database className="w-4 h-4" />
              Skema SQL Supabase
            </button>
          </nav>

          <div className="pt-3 border-t border-slate-100">
            {currentUser ? (
              <div className="space-y-2">
                <div className="px-3 py-2 bg-slate-50 rounded-md">
                  <p className="text-sm font-semibold text-slate-800">{currentUser.nama}</p>
                  <p className="text-xs text-slate-500 capitalize">
                    {currentUser.role === 'admin' ? '🛡️ Admin DesainKu' : '👤 Pelanggan'} · {currentUser.email}
                  </p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 px-3 text-red-600 text-sm font-medium flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleNav({ name: 'login' })}
                  className="w-full py-2.5 text-center text-sm font-medium text-slate-700 border border-slate-200 rounded-lg"
                >
                  Masuk
                </button>
                <button
                  onClick={() => handleNav({ name: 'daftar' })}
                  className="w-full py-2.5 text-center text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Daftar Akun Baru
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
