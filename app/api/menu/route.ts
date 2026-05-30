import { getDb } from '@/lib/db';
import { getAuthFromCookie } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { menuItemSchema } from '@/lib/validation';
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '@/lib/constants';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(MAX_PAGE_SIZE, parseInt(searchParams.get('limit') || String(DEFAULT_PAGE_SIZE), 10));
    const skip = (page - 1) * limit;

    const db = await getDb();
    const menuCollection = db.collection('menu_items');

    const query: any = {};
    if (category) query.category = category;
    if (search) query.$text = { $search: search };
    
    const items = await menuCollection
      .find(query)
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await menuCollection.countDocuments(query);

    return NextResponse.json({
      items: items.map((item) => ({
        ...item,
        _id: item._id.toString(),
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error('Menu fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthFromCookie();
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin credentials required.' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate request body
    const validationResult = menuItemSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid menu item data', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const db = await getDb();
    const menuCollection = db.collection('menu_items');

    const result = await menuCollection.insertOne({
      ...validationResult.data,
      createdAt: new Date(),
    });

    logger.info('Menu item created', { itemId: result.insertedId });

    return NextResponse.json({
      _id: result.insertedId.toString(),
      ...validationResult.data,
    });
  } catch (error) {
    logger.error('Menu creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create menu item' },
      { status: 500 }
    );
  }
}

