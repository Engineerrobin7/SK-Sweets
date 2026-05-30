'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  UtensilsCrossed,
  CalendarCheck,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (mounted && (!user || user.role !== 'admin')) {
      router.push('/auth/login');
    }
  }, [user, router, mounted]);

  if (!mounted || !user || user.role !== 'admin') {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    logout();
    router.push('/auth/login');
  };

  const menuItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Menu Items', href: '/admin/products', icon: UtensilsCrossed },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Bookings', href: '/admin/bookings', icon: CalendarCheck },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-80' : 'w-24'
        } bg-slate-900 transition-all duration-300 flex flex-col fixed inset-y-0 left-0 z-50`}
      >
        <div className="h-24 flex items-center px-8 border-b border-white/5 overflow-hidden whitespace-nowrap">
          <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shrink-0">
            <span className="text-white font-serif font-black">SK</span>
          </div>
          <span className={`ml-4 text-white font-serif font-black text-xl transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
            SK SWEETS
          </span>
        </div>

        <nav className="flex-1 py-10 px-4 space-y-2 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all group overflow-hidden ${
                  isActive
                    ? 'bg-orange-600 text-white'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`w-6 h-6 shrink-0 ${isActive ? '' : 'group-hover:scale-110 transition-transform'}`} />
                <span className={`font-bold text-sm tracking-widest uppercase transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-red-400 hover:bg-red-400/10 transition-all overflow-hidden"
          >
            <LogOut className="w-6 h-6 shrink-0" />
            <span className={`font-bold text-sm tracking-widest uppercase transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
              Sign Out
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-80' : 'ml-24'}`}>
        {/* Top Header */}
        <header className="h-24 bg-white border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <Menu className="w-6 h-6 text-slate-600" />
            </button>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">
              {menuItems.find(i => i.href === pathname)?.name || 'Admin'}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-orange-600 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-4 pl-6 border-l border-slate-100">
               <div className="text-right">
                  <p className="text-sm font-black text-slate-900 leading-none mb-1">{user.username}</p>
                  <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">Root Administrator</p>
               </div>
               <div className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold">
                  {user.username[0].toUpperCase()}
               </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
