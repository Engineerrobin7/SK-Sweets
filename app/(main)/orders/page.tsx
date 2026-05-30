'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { Package, Clock, CheckCircle2, XCircle, ArrowRight, ShoppingBag, MapPin, Calendar, ReceiptText } from 'lucide-react';
import { toast } from 'sonner';

interface Order {
  _id: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
  };
  total: number;
  status: string;
  items: Array<{
    _id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  createdAt: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const user = useStore((state) => state.user);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    fetchOrders();
  }, [user, router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      toast.error('Failed to load order history');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold">Fetching your history...</p>
        </div>
      </div>
    );
  }

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
      case 'completed':
        return 'bg-green-50 text-green-600 border-green-100';
      case 'shipped':
      case 'processing':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'cancelled':
        return 'bg-red-50 text-red-600 border-red-100';
      default:
        return 'bg-amber-50 text-amber-600 border-amber-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'shipped':
      case 'processing':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="pt-32 pb-32 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest mb-4">
              <ReceiptText className="w-3.5 h-3.5" /> Purchase History
            </div>
            <h1 className="text-5xl font-serif font-black text-slate-900">Your <span className="text-orange-600">Orders.</span></h1>
          </div>
          <Link
            href="/menu"
            className="group inline-flex items-center gap-2 bg-white px-6 py-3 rounded-2xl border border-slate-200 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
          >
            Order New Sweets <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-100 shadow-xl">
             <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <ShoppingBag className="w-12 h-12 text-slate-300" />
             </div>
             <h2 className="text-3xl font-black text-slate-900 mb-4">No orders yet</h2>
             <p className="text-slate-500 mb-10 max-w-sm mx-auto">Start your sweet journey by exploring our royal collection today.</p>
             <Link
                href="/menu"
                className="inline-flex items-center justify-center px-10 py-5 bg-orange-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-orange-100 hover:bg-orange-700 transition-all"
              >
                Explore Menu
              </Link>
          </div>
        ) : (
          <div className="space-y-10">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                {/* Header */}
                <div className="px-8 py-6 bg-slate-50/50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-6">
                   <div className="flex items-center gap-10">
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Order Placed</p>
                         <div className="flex items-center gap-2 font-bold text-slate-900">
                            <Calendar className="w-4 h-4 text-orange-600" />
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                         </div>
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Value</p>
                         <p className="font-black text-slate-900 text-xl">₹{order.total.toFixed(0)}</p>
                      </div>
                      <div className="hidden sm:block">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Delivering To</p>
                         <div className="flex items-center gap-2 font-bold text-slate-900">
                            <MapPin className="w-4 h-4 text-orange-600" />
                            {order.customerInfo.city}
                         </div>
                      </div>
                   </div>

                   <div className="flex flex-col items-end">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                      <div className={`px-4 py-1.5 rounded-full border text-xs font-black uppercase tracking-widest flex items-center gap-2 ${getStatusStyle(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </div>
                   </div>
                </div>

                {/* Items */}
                <div className="p-8">
                   <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                           <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center font-black text-orange-600 border border-slate-100 shadow-sm">
                              {item.quantity}x
                           </div>
                           <div>
                              <p className="font-black text-slate-900">{item.name}</p>
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">₹{item.price} per unit</p>
                           </div>
                        </div>
                      ))}
                   </div>

                   {/* Footer Info */}
                   <div className="mt-10 pt-8 border-t border-slate-50 flex flex-wrap items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                            <ReceiptText className="w-5 h-5" />
                         </div>
                         <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Order ID: <span className="text-slate-900">{order._id}</span></p>
                      </div>

                      <button className="px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-colors">
                        Track Delivery
                      </button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
