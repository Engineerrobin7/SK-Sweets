'use client';

import { useEffect, useState } from 'react';
import {
  TrendingUp,
  Users,
  ShoppingBag,
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  MoreVertical,
  CalendarDays
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface Stats {
  revenue: number;
  orders: number;
  customers: number;
  bookings: number;
  recentOrders: any[];
  categoryStats: any[];
}

const COLORS = ['#ea580c', '#0f172a', '#64748b', '#f59e0b', '#10b981'];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        setStats(await response.json());
      }
    } catch (error) {
      console.error('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="space-y-10 animate-pulse">
        <div className="grid grid-cols-4 gap-8">
           {[1,2,3,4].map(i => <div key={i} className="h-40 bg-white rounded-[2rem]"></div>)}
        </div>
        <div className="grid grid-cols-12 gap-8">
           <div className="col-span-8 h-96 bg-white rounded-[2.5rem]"></div>
           <div className="col-span-4 h-96 bg-white rounded-[2.5rem]"></div>
        </div>
      </div>
    );
  }

  const kpiData = [
    { label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: IndianRupee, change: '+12.5%', isUp: true },
    { label: 'Total Orders', value: stats.orders, icon: ShoppingBag, change: '+5.2%', isUp: true },
    { label: 'Total Customers', value: stats.customers, icon: Users, change: '+18.1%', isUp: true },
    { label: 'Bulk Bookings', value: stats.bookings, icon: CalendarDays, change: '-2.4%', isUp: false },
  ];

  return (
    <div className="space-y-10">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {kpiData.map((kpi, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
                 <kpi.icon className="w-6 h-6 text-slate-900" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-black ${kpi.isUp ? 'text-green-500' : 'text-red-500'}`}>
                {kpi.isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingUp className="w-4 h-4 rotate-180" />}
                {kpi.change}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</p>
              <h3 className="text-3xl font-black text-slate-900">{kpi.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Sales Chart */}
        <div className="col-span-12 lg:col-span-8 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest">Revenue Analytics</h3>
              <p className="text-slate-400 text-xs font-bold mt-1">Monthly sales performance summary</p>
            </div>
            <select className="bg-slate-50 border-none rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Year to Date</option>
            </select>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Mon', total: 4000 },
                { name: 'Tue', total: 3000 },
                { name: 'Wed', total: 2000 },
                { name: 'Thu', total: 2780 },
                { name: 'Fri', total: 1890 },
                { name: 'Sat', total: 2390 },
                { name: 'Sun', total: 3490 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                />
                <Bar dataKey="total" fill="#ea580c" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share */}
        <div className="col-span-12 lg:col-span-4 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
           <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest mb-10">Menu Distribution</h3>
           <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.categoryStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {stats.categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
           </div>
           <div className="space-y-4 mt-6">
              {stats.categoryStats.slice(0, 4).map((c, i) => (
                <div key={i} className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                      <span className="text-xs font-bold text-slate-600 tracking-wider">{c.name}</span>
                   </div>
                   <span className="text-xs font-black text-slate-900">{c.value} items</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-10">
           <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest">Recent Transactions</h3>
           <button className="text-orange-600 font-black text-xs uppercase tracking-widest flex items-center gap-2">
             View All Orders <ArrowUpRight className="w-4 h-4" />
           </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-slate-50">
                <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Customer</th>
                <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Product</th>
                <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount</th>
                <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Time</th>
                <th className="pb-6"></th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order, i) => (
                <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-6">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-xs">
                           {order.customerInfo.firstName[0]}
                        </div>
                        <div>
                           <p className="font-bold text-slate-900">{order.customerInfo.firstName} {order.customerInfo.lastName}</p>
                           <p className="text-[10px] text-slate-400 font-bold">{order.customerInfo.email}</p>
                        </div>
                     </div>
                  </td>
                  <td className="py-6">
                    <p className="text-sm font-bold text-slate-600">{order.items[0]?.name} {order.items.length > 1 ? `+ ${order.items.length - 1} more` : ''}</p>
                  </td>
                  <td className="py-6">
                    <p className="font-black text-slate-900">₹{order.total}</p>
                  </td>
                  <td className="py-6">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest ${
                      order.status === 'delivered' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                       <Clock className="w-3 h-3" /> {order.status}
                    </div>
                  </td>
                  <td className="py-6">
                    <p className="text-xs font-bold text-slate-400">{new Date(order.createdAt).toLocaleTimeString()}</p>
                  </td>
                  <td className="py-6 text-right">
                    <button className="p-2 hover:bg-white rounded-lg transition-colors">
                       <MoreVertical className="w-5 h-5 text-slate-400" />
                    </button>
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
