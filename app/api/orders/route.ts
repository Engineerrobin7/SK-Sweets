import { getDb } from '@/lib/db';
import { getAuthFromCookie } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { orderSchema } from '@/lib/validation';
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '@/lib/constants';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthFromCookie();

    if (!auth) {
      return NextResponse.json(
        { error: 'Authentication required to create an order' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate request body
    const validationResult = orderSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid order data', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const db = await getDb();
    const ordersCollection = db.collection('orders');

    const order = {
      userId: auth.userId,
      items: validationResult.data.items,
      customerInfo: validationResult.data.customerInfo,
      total: validationResult.data.total,
      giftMessage: validationResult.data.giftMessage,
      couponCode: validationResult.data.couponCode,
      status: 'pending',
      createdAt: new Date(),
    };

    const result = await ordersCollection.insertOne(order);

    logger.info('Order created successfully', { orderId: result.insertedId, userId: auth.userId });

    return NextResponse.json({
      _id: result.insertedId.toString(),
      ...order,
    });
  } catch (error) {
    logger.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthFromCookie();

    if (!auth) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(MAX_PAGE_SIZE, parseInt(searchParams.get('limit') || String(DEFAULT_PAGE_SIZE), 10));
    const skip = (page - 1) * limit;

    const db = await getDb();
    const ordersCollection = db.collection('orders');

    // Isolate histories: Return all orders for admins, or filter strictly by userId for standard users
    const query = auth.role === 'admin' ? {} : { userId: auth.userId };
    
    const orders = await ordersCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await ordersCollection.countDocuments(query);

    return NextResponse.json({
      orders: orders.map((order) => ({
        ...order,
        _id: order._id.toString(),
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error('Fetch orders error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

