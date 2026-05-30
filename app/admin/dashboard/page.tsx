'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

interface Order {
  _id: string;
  customerInfo: {
    firstName: string;
    email: string;
  };
  total: number;
  status: string;
  createdAt: string;
}

interface Booking {
  _id: string;
  name: string;
  date: string;
  time: string;
  guests: string;
  status: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const user = useStore((state) => state.user);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'bookings' | 'menu'>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/admin/login');
      return;
    }

    fetchData();
  }, [user, router]);

  const fetchData = async () => {
    try {
      const [ordersRes, bookingsRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/bookings'),
      ]);

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
      }

      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      useStore.setState({ user: null, isAuthenticated: false });
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status } : order
          )
        );
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === bookingId ? { ...booking, status } : booking
          )
        );
      }
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-900 to-orange-900 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-amber-100 text-sm">Welcome, {user.username}</p>
            </div>
            <Button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          {(['overview', 'orders', 'bookings', 'menu'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === tab
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-amber-900 hover:bg-amber-50 border border-amber-200'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Orders', value: orders.length, color: 'amber' },
              { label: 'Total Bookings', value: bookings.length, color: 'orange' },
              {
                label: 'Revenue',
                value: `$${orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}`,
                color: 'green',
              },
              {
                label: 'Pending Orders',
                value: orders.filter((o) => o.status === 'pending').length,
                color: 'red',
              },
            ].map((stat) => (
              <Card key={stat.label} className={`p-6 border-${stat.color}-200`}>
                <p className={`text-${stat.color}-700 text-sm font-medium`}>{stat.label}</p>
                <p className={`text-3xl font-bold text-${stat.color}-900 mt-2`}>{stat.value}</p>
              </Card>
            ))}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <Card className="border-amber-200 overflow-hidden">
            <div className="p-6 border-b border-amber-200">
              <h2 className="text-2xl font-bold text-amber-900">Orders</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-amber-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-amber-900">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-amber-900">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-amber-900">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-amber-900">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-200">
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order._id} className="hover:bg-amber-50">
                        <td className="px-6 py-4 text-sm text-amber-900">
                          {order.customerInfo.firstName}
                          <br />
                          <span className="text-amber-600 text-xs">{order.customerInfo.email}</span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-amber-900">
                          ${order.total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              order.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            className="border border-amber-200 rounded px-2 py-1"
                          >
                            <option value="pending">Pending</option>
                            <option value="preparing">Preparing</option>
                            <option value="ready">Ready</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-amber-600">
                        No orders yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <Card className="border-amber-200 overflow-hidden">
            <div className="p-6 border-b border-amber-200">
              <h2 className="text-2xl font-bold text-amber-900">Reservations</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-amber-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-amber-900">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-amber-900">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-amber-900">
                      Guests
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-amber-900">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-amber-900">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-200">
                  {bookings.length > 0 ? (
                    bookings.map((booking) => (
                      <tr key={booking._id} className="hover:bg-amber-50">
                        <td className="px-6 py-4 text-sm font-medium text-amber-900">
                          {booking.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-amber-700">
                          {new Date(booking.date).toLocaleDateString()} {booking.time}
                        </td>
                        <td className="px-6 py-4 text-sm text-amber-700">{booking.guests}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <select
                            value={booking.status}
                            onChange={(e) => updateBookingStatus(booking._id, e.target.value)}
                            className="border border-amber-200 rounded px-2 py-1"
                          >
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-amber-600">
                        No bookings yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Menu Tab */}
        {activeTab === 'menu' && (
          <Card className="border-amber-200 p-6">
            <h2 className="text-2xl font-bold text-amber-900 mb-6">Menu Management</h2>
            <Link href="/admin/menu">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                Manage Menu Items
              </Button>
            </Link>
            <p className="text-amber-700 mt-4">Click the button to add or edit menu items</p>
          </Card>
        )}
      </div>
    </div>
  );
}
