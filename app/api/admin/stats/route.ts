import { getDb } from '@/lib/db';
import { getAuthFromCookie } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthFromCookie();

    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();

    // Total Revenue
    const orders = await db.collection('orders').find({ status: { $ne: 'cancelled' } }).toArray();
    const totalRevenue = orders.reduce((acc, order) => acc + (order.total || 0), 0);

    // Total Orders
    const totalOrders = await db.collection('orders').countDocuments();

    // Total Customers
    const totalCustomers = await db.collection('users').countDocuments({ role: 'user' });

    // Total Bookings
    const totalBookings = await db.collection('bookings').countDocuments();

    // Recent Orders (last 5)
    const recentOrders = await db.collection('orders')
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    // Stats by category for a chart
    const categoryStats = await db.collection('menu_items').aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    return NextResponse.json({
      revenue: totalRevenue,
      orders: totalOrders,
      customers: totalCustomers,
      bookings: totalBookings,
      recentOrders: recentOrders.map(o => ({ ...o, _id: o._id.toString() })),
      categoryStats: categoryStats.map(c => ({ name: c._id, value: c.count }))
    });
  } catch (error) {
    logger.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
