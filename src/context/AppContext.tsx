import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, Order, OrderImage, PageRoute, OrderStatus } from '../types';
import { INITIAL_PROFILES, INITIAL_ORDERS } from '../data/mockData';

interface AppContextType {
  currentUser: Profile | null;
  currentRoute: PageRoute;
  orders: Order[];
  profiles: Profile[];
  navigateTo: (route: PageRoute) => void;
  login: (email: string, password: string) => { success: boolean; message?: string };
  register: (nama: string, no_whatsapp: string, email: string, password: string) => { success: boolean; message?: string };
  logout: () => void;
  switchDemoUser: (userId: string) => void;
  createOrder: (orderInput: {
    jenis_desain: 'flyer' | 'banner';
    ukuran: string;
    teks: string;
    warna: string;
    catatan?: string;
    images: { file_name: string; file_url: string; file_size?: number }[];
  }) => { success: boolean; orderId?: string; message?: string };
  updateOrderAdmin: (
    orderId: string,
    updates: {
      status: OrderStatus;
      harga: number | null;
      batas_waktu: string | null;
    }
  ) => { success: boolean; message?: string };
  getOrderById: (orderId: string) => Order | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ORDERS: 'desainku_orders_v1',
  PROFILES: 'desainku_profiles_v1',
  CURRENT_USER: 'desainku_current_user_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Load profiles
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILES);
      return saved ? JSON.parse(saved) : INITIAL_PROFILES;
    } catch {
      return INITIAL_PROFILES;
    }
  });

  // 2. Load current user (default to first customer Budi for easy review)
  const [currentUser, setCurrentUser] = useState<Profile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (saved) return JSON.parse(saved);
      return INITIAL_PROFILES[0]; // Budi Santoso
    } catch {
      return INITIAL_PROFILES[0];
    }
  });

  // 3. Load orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // 4. Client route
  const [currentRoute, setCurrentRoute] = useState<PageRoute>({ name: 'home' });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.warn('Could not save orders to localStorage', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
    } catch (e) {
      console.warn('Could not save profiles to localStorage', e);
    }
  }, [profiles]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    } catch (e) {
      console.warn('Could not save currentUser to localStorage', e);
    }
  }, [currentUser]);

  // Route navigation with PRD protection rules
  const navigateTo = (route: PageRoute) => {
    // Rule: Belum login lalu buka halaman pesanan atau admin, diarahkan ke login
    if (!currentUser && (
      route.name === 'pesanan' ||
      route.name === 'pesanan_baru' ||
      route.name === 'pesanan_detail' ||
      route.name === 'admin' ||
      route.name === 'admin_pesanan_detail'
    )) {
      setCurrentRoute({ name: 'login' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Rule: Pelanggan membuka halaman admin diarahkan ke /pesanan
    if (currentUser && currentUser.role === 'customer' && (
      route.name === 'admin' ||
      route.name === 'admin_pesanan_detail'
    )) {
      setCurrentRoute({ name: 'pesanan' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const login = (email: string, _password: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const foundUser = profiles.find((p) => p.email.toLowerCase() === trimmedEmail);

    if (!foundUser) {
      return {
        success: false,
        message: 'Email belum terdaftar. Silakan daftar akun baru atau pilih salah satu akun contoh.',
      };
    }

    setCurrentUser(foundUser);
    if (foundUser.role === 'admin') {
      navigateTo({ name: 'admin' });
    } else {
      navigateTo({ name: 'pesanan' });
    }

    return { success: true };
  };

  const register = (nama: string, no_whatsapp: string, email: string, _password: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = nama.trim();
    const trimmedWa = no_whatsapp.trim();

    if (!trimmedName || !trimmedWa || !trimmedEmail) {
      return { success: false, message: 'Semua kolom wajib diisi dengan benar.' };
    }

    const existing = profiles.find((p) => p.email.toLowerCase() === trimmedEmail);
    if (existing) {
      return { success: false, message: 'Email sudah terdaftar. Silakan login.' };
    }

    const newProfile: Profile = {
      id: 'user-' + Math.random().toString(36).substring(2, 9),
      nama: trimmedName,
      no_whatsapp: trimmedWa,
      email: trimmedEmail,
      role: 'customer', // Selalu customer sesuai aturan PRD
      created_at: new Date().toISOString(),
    };

    setProfiles((prev) => [...prev, newProfile]);
    setCurrentUser(newProfile);
    navigateTo({ name: 'pesanan' });

    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentRoute({ name: 'home' });
  };

  const switchDemoUser = (userId: string) => {
    const target = profiles.find((p) => p.id === userId);
    if (target) {
      setCurrentUser(target);
      if (target.role === 'admin') {
        navigateTo({ name: 'admin' });
      } else {
        navigateTo({ name: 'pesanan' });
      }
    }
  };

  const createOrder = (orderInput: {
    jenis_desain: 'flyer' | 'banner';
    ukuran: string;
    teks: string;
    warna: string;
    catatan?: string;
    images: { file_name: string; file_url: string; file_size?: number }[];
  }) => {
    if (!currentUser) {
      return { success: false, message: 'Anda harus login terlebih dahulu.' };
    }

    const orderNumber = Math.floor(2600 + orders.length + Math.random() * 50);
    const orderId = `DK-${orderNumber}`;
    const nowIso = new Date().toISOString();

    const formattedImages: OrderImage[] = orderInput.images.map((img, idx) => ({
      id: `img-${Date.now()}-${idx}`,
      order_id: orderId,
      file_name: img.file_name,
      file_url: img.file_url,
      file_size: img.file_size,
      created_at: nowIso,
    }));

    const newOrder: Order = {
      id: orderId,
      customer_id: currentUser.id,
      customer_nama: currentUser.nama,
      customer_whatsapp: currentUser.no_whatsapp,
      customer_email: currentUser.email,
      jenis_desain: orderInput.jenis_desain,
      ukuran: orderInput.ukuran,
      teks: orderInput.teks,
      warna: orderInput.warna,
      catatan: orderInput.catatan,
      status: 'baru',
      harga: null,
      batas_waktu: null,
      tanggal_pesan: nowIso,
      updated_at: nowIso,
      images: formattedImages,
    };

    setOrders((prev) => [newOrder, ...prev]);
    return { success: true, orderId };
  };

  const updateOrderAdmin = (
    orderId: string,
    updates: {
      status: OrderStatus;
      harga: number | null;
      batas_waktu: string | null;
    }
  ) => {
    if (!currentUser || currentUser.role !== 'admin') {
      return { success: false, message: 'Hanya admin yang berhak mengelola pesanan.' };
    }

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status: updates.status,
            harga: updates.harga,
            batas_waktu: updates.batas_waktu,
            updated_at: new Date().toISOString(),
          };
        }
        return order;
      })
    );

    return { success: true };
  };

  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.id === orderId);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRoute,
        orders,
        profiles,
        navigateTo,
        login,
        register,
        logout,
        switchDemoUser,
        createOrder,
        updateOrderAdmin,
        getOrderById,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
