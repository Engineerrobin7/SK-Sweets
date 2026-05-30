import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { logger } from '@/lib/logger';
import { getAuthFromCookie } from '@/lib/auth';
import { menuItemSchema } from '@/lib/validation';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const db = await getDb();
    const item = await db.collection('menu_items').findOne({ _id: new ObjectId(id) });

    if (!item) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...item,
      _id: item._id.toString(),
    });
  } catch (error) {
    logger.error('Fetch menu item error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const auth = await getAuthFromCookie();

    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = menuItemSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid data', details: validation.error.errors }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.collection('menu_items').updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...validation.data, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Update menu item error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const auth = await getAuthFromCookie();

    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    const result = await db.collection('menu_items').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Delete menu item error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
