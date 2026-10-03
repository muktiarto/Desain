import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import { OrderStatus } from '../types';
import { 
  Search, 
  MessageSquare, 
  Layers, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Filter, 
  DollarSign, 
  User, 
  Phone, 
  Calendar,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export const AdminOrdersPage: React.FC = () => {
  const { orders, navigateTo } = useApp();
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Admin sees all orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      order.id.toLowerCase().includes(q) ||
      (order.customer_nama && order.customer_nama.toLowerCase().includes(q)) ||
      (order.customer_whatsapp && order.customer_whatsapp.includes(q)) ||
      order.teks.toLowerCase().includes(q) ||
      order.ukuran.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  // Calculate quick stats
  const totalOrders = orders.length;
  const countBaru = orders.filter((o) => o.status === 'baru').length;
  const countDikerjakan = orders.filter((o) => o.status === 'dikerjakan').length;
  const countSelesai = orders.filter((o) => o.status === 'selesai').length;
  const totalOmset = orders.reduce((sum, o) => sum + (o.harga || 0), 0);

  const formatRupiah = (val?: number | null) => {
    if (val === null || val === undefined) return '-';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return isoString;
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Admin Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[11px] font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Panel Pemilik Usaha
            </span>
            <span className="text-xs text-slate-400">· Admin DesainKu</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Semua Pesanan Masuk
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Kelola status pesanan, tentukan harga, dan koordinasikan dengan pelanggan via WhatsApp.
          </p>
        </div>

        <button
          onClick={() => navigateTo({ name: 'sql_schema' })}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          Lihat Skema Supabase RLS
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block">Total Pesanan</span>
          <p className="text-xl font-bold text-slate-900 tabular-nums mt-1">{totalOrders}</p>
          <span className="text-[11px] text-slate-400">Semua riwayat</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/20 shadow-2xs">
          <span className="text-xs text-blue-700 font-medium block">Perlu Dikonfirmasi</span>
          <p className="text-xl font-bold text-blue-700 tabular-nums mt-1">{countBaru}</p>
          <span className="text-[11px] text-blue-600/80">Status: Baru</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/20 shadow-2xs">
          <span className="text-xs text-amber-700 font-medium block">Sedang Dikerjakan</span>
          <p className="text-xl font-bold text-amber-800 tabular-nums mt-1">{countDikerjakan}</p>
          <span className="text-[11px] text-amber-600/80">Dalam proses desain</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-2xs">
          <span className="text-xs text-emerald-700 font-medium block">Selesai</span>
          <p className="text-xl font-bold text-emerald-800 tabular-nums mt-1">{countSelesai}</p>
          <span className="text-[11px] text-emerald-600/80">Siap serah terima</span>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block">Total Nilai Pesanan</span>
          <p className="text-lg font-bold text-slate-900 tabular-nums mt-1 truncate">
            {formatRupiah(totalOmset)}
          </p>
          <span className="text-[11px] text-slate-400">Estimasi omset</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Status Filter */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({totalOrders})
          </button>
          <button
            onClick={() => setStatusFilter('baru')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              statusFilter === 'baru'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Baru ({countBaru})
          </button>
          <button
            onClick={() => setStatusFilter('dikerjakan')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              statusFilter === 'dikerjakan'
                ? 'bg-white text-amber-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dikerjakan ({countDikerjakan})
          </button>
          <button
            onClick={() => setStatusFilter('selesai')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              statusFilter === 'selesai'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Selesai ({countSelesai})
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari ID, nama pelanggan, no WA..."
            className="w-full pl-9 pr-3.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
          />
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="mt-6 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            Tidak ada pesanan yang sesuai dengan filter atau kata kunci pencarian.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">ID & Tanggal</th>
                  <th className="py-3 px-4">Pelanggan & Kontak WhatsApp</th>
                  <th className="py-3 px-4">Jenis & Ukuran Desain</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Harga</th>
                  <th className="py-3 px-4">Batas Waktu</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredOrders.map((order) => {
                  const cleanWa = getCleanWa(order.customer_whatsapp);
                  const waText = encodeURIComponent(
                    `Halo Kak ${order.customer_nama}, ini dari Admin DesainKu terkait pesanan #${order.id} (${order.jenis_desain === 'flyer' ? 'Flyer' : 'Banner'}).`
                  );
                  const waLink = `https://wa.me/${cleanWa}?text=${waText}`;

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-blue-50/30 transition-colors group"
                    >
                      {/* ID & Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-slate-900 group-hover:text-blue-600 block">
                          #{order.id}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {formatDate(order.tanggal_pesan)}
                        </span>
                      </td>

                      {/* Customer Info & WA link */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <p className="font-semibold text-slate-900">
                          {order.customer_nama || 'Pelanggan'}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-slate-500 font-mono text-[11px]">
                            {order.customer_whatsapp || '-'}
                          </span>
                          {cleanWa && (
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Chat WhatsApp Pelanggan"
                              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-medium transition-colors"
                            >
                              <MessageSquare className="w-3 h-3" />
                              WA
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Design specs */}
                      <td className="py-3.5 px-4 max-w-[200px]">
                        <span className="font-semibold text-slate-800 capitalize block">
                          {order.jenis_desain === 'flyer' ? 'Flyer' : 'Banner'}
                        </span>
                        <span className="text-slate-500 text-[11px] block truncate">
                          {order.ukuran}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={order.status} size="sm" />
                      </td>

                      {/* Harga */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-right font-medium tabular-nums">
                        {order.harga ? (
                          <span className="font-semibold text-slate-900">
                            {formatRupiah(order.harga)}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Belum diisi</span>
                        )}
                      </td>

                      {/* Batas Waktu */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-[11px]">
                        {order.batas_waktu ? (
                          <span className="font-medium text-slate-700">
                            {formatDate(order.batas_waktu)}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Belum diisi</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => navigateTo({ name: 'admin_pesanan_detail', orderId: order.id })}
                          className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors cursor-pointer"
                        >
                          Detail & Kelola →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
