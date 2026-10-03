import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import { OrderStatus } from '../types';
import { 
  PlusCircle, 
  Search, 
  Calendar, 
  ArrowRight, 
  FileText, 
  Tag, 
  Clock, 
  FileQuestion,
  Filter
} from 'lucide-react';

export const CustomerOrdersPage: React.FC = () => {
  const { currentUser, orders, navigateTo } = useApp();
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Pelanggan hanya boleh melihat pesanan miliknya sendiri
  const userOrders = orders.filter((o) => o.customer_id === currentUser?.id);

  const filteredOrders = userOrders.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.teks.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.ukuran.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const formatRupiah = (val?: number | null) => {
    if (val === null || val === undefined) {
      return 'Menunggu penentuan admin';
    }
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Pesanan Saya
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pantau status pengerjaan, harga resmi, dan batas waktu selesai pesanan desain Anda.
          </p>
        </div>

        <button
          onClick={() => navigateTo({ name: 'pesanan_baru' })}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Buat Pesanan Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Segmented status filter */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({userOrders.length})
          </button>
          <button
            onClick={() => setStatusFilter('baru')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              statusFilter === 'baru'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Baru ({userOrders.filter((o) => o.status === 'baru').length})
          </button>
          <button
            onClick={() => setStatusFilter('dikerjakan')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              statusFilter === 'dikerjakan'
                ? 'bg-white text-amber-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dikerjakan ({userOrders.filter((o) => o.status === 'dikerjakan').length})
          </button>
          <button
            onClick={() => setStatusFilter('selesai')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              statusFilter === 'selesai'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Selesai ({userOrders.filter((o) => o.status === 'selesai').length})
          </button>
        </div>

        {/* Search box */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari ID atau detail pesanan..."
            className="w-full pl-9 pr-3.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
          />
        </div>
      </div>

      {/* Orders List Content */}
      <div className="mt-6">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-lg mx-auto my-6 shadow-2xs">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <FileQuestion className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Belum Ada Pesanan
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              {searchQuery || statusFilter !== 'all'
                ? 'Tidak ada pesanan yang sesuai dengan filter pencarian Anda.'
                : 'Anda belum membuat pesanan desain grafis apapun. Silakan kirimkan pesanan flyer atau spanduk banner pertama Anda.'}
            </p>
            <button
              onClick={() => navigateTo({ name: 'pesanan_baru' })}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Buat Pesanan Sekarang</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => navigateTo({ name: 'pesanan_detail', orderId: order.id })}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  {/* Top Header: ID & Status */}
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
                    <span className="font-mono text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      #{order.id}
                    </span>
                    <StatusBadge status={order.status} size="sm" />
                  </div>

                  {/* Title & Type */}
                  <div className="mb-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                      <span className="capitalize font-semibold text-slate-700">
                        {order.jenis_desain === 'flyer' ? 'Flyer / Brosur' : 'Banner / Spanduk'}
                      </span>
                      <span>·</span>
                      <span className="truncate">{order.ukuran}</span>
                    </div>

                    <p className="text-sm font-medium text-slate-800 line-clamp-2 leading-snug">
                      {order.teks.split('\n')[0]}
                    </p>
                  </div>

                  {/* Visual Metadata info */}
                  <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Harga:</span>
                      <span className={`font-semibold tabular-nums ${order.harga ? 'text-slate-900' : 'text-slate-400 italic text-[11px]'}`}>
                        {formatRupiah(order.harga)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Batas Waktu:</span>
                      <span className="font-medium text-slate-700">
                        {order.batas_waktu ? formatDate(order.batas_waktu) : <span className="text-slate-400 italic text-[11px]">Belum ditentukan</span>}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px] text-slate-400">
                      <span>Dipesan:</span>
                      <span>{formatDate(order.tanggal_pesan)}</span>
                    </div>
                  </div>
                </div>

                {/* Footer link */}
                <div className="pt-2 flex items-center justify-between text-xs font-medium text-blue-600 group-hover:text-blue-700">
                  <span>Lihat Detail Pesanan</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
