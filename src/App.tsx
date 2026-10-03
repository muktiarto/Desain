/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CustomerOrdersPage } from './pages/CustomerOrdersPage';
import { NewOrderPage } from './pages/NewOrderPage';
import { CustomerOrderDetailPage } from './pages/CustomerOrderDetailPage';
import { AdminOrdersPage } from './pages/AdminOrdersPage';
import { AdminOrderDetailPage } from './pages/AdminOrderDetailPage';
import { DatabaseSchemaPage } from './components/DatabaseSchemaModal';

const AppContent: React.FC = () => {
  const { currentRoute } = useApp();

  const renderCurrentPage = () => {
    switch (currentRoute.name) {
      case 'home':
        return <HomePage />;
      case 'login':
        return <LoginPage />;
      case 'daftar':
        return <RegisterPage />;
      case 'pesanan':
        return <CustomerOrdersPage />;
      case 'pesanan_baru':
        return <NewOrderPage />;
      case 'pesanan_detail':
        return <CustomerOrderDetailPage orderId={currentRoute.orderId} />;
      case 'admin':
        return <AdminOrdersPage />;
      case 'admin_pesanan_detail':
        return <AdminOrderDetailPage orderId={currentRoute.orderId} />;
      case 'sql_schema':
        return <DatabaseSchemaPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <main className="flex-1">
        {renderCurrentPage()}
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
