'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  MoreVertical,
  Eye,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  ArrowUpRight,
  ExternalLink,
  ChevronRight,
  User,
  MapPin,
  CreditCard
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  items: any[];
  createdAt: string;
  giftMessage?: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        toast.success(`Order marked as ${newStatus}`);
        fetchOrders();
      }
    } catch (error) {
      toast.error('Status update failed');
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-50 text-green-600 border-green-100';
      case 'shipped': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-amber-50 text-amber-600 border-amber-100';
    }
  };

  const filtered = orders.filter(o =>
    o.customerInfo.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o._id.includes(searchTerm)
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <Input
            placeholder="Search by Order ID or Name..."
            className="h-14 pl-12 rounded-2xl bg-white border-slate-100 font-bold focus:ring-orange-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
           <Button variant="outline" className="h-14 px-6 rounded-2xl border-2 font-black text-xs uppercase tracking-widest flex items-center gap-2">
              <Filter className="w-5 h-5" /> Filter
           </Button>
           <Button className="h-14 px-8 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest flex items-center gap-3">
              Export CSV
           </Button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-slate-50/50 border-b border-slate-100">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Order / Customer</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Purchase Details</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Amount</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date</th>
                <th className="px-10 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                [1,2,3].map(i => <tr key={i} className="animate-pulse"><td colSpan={6} className="p-10"><div className="h-16 bg-slate-50 rounded-2xl"></div></td></tr>)
              ) : filtered.map((order) => (
                <tr key={order._id} className="group hover:bg-slate-50/30 transition-colors">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                          <User className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="font-black text-slate-900">#{order._id.slice(-6).toUpperCase()}</p>
                          <p className="text-xs font-bold text-slate-500">{order.customerInfo.firstName} {order.customerInfo.lastName}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                     <p className="text-sm font-bold text-slate-900">{order.items.length} Varieties</p>
                     <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">
                       {order.giftMessage ? '🎁 Includes Gift Note' : 'Standard Order'}
                     </p>
                  </td>
                  <td className="px-10 py-8">
                    <p className="font-black text-slate-900 text-lg">₹{order.total.toLocaleString()}</p>
                  </td>
                  <td className="px-10 py-8">
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStatusStyle(order.status)}`}>
                       <Clock className="w-3.5 h-3.5" />
                       {order.status}
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <p className="text-xs font-bold text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button
                         onClick={() => updateStatus(order._id, 'shipped')}
                         className="p-2.5 hover:bg-blue-50 rounded-xl transition-all text-slate-400 hover:text-blue-600"
                         title="Mark as Shipped"
                       >
                          <Truck className="w-5 h-5" />
                       </button>
                       <button
                         onClick={() => updateStatus(order._id, 'delivered')}
                         className="p-2.5 hover:bg-green-50 rounded-xl transition-all text-slate-400 hover:text-green-600"
                         title="Mark as Delivered"
                       >
                          <CheckCircle2 className="w-5 h-5" />
                       </button>
                       <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-slate-900">
                          <Eye className="w-5 h-5" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
