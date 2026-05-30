import { getDb } from '@/lib/db';
import { getAuthFromCookie } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthFromCookie();
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const db = await getDb();
    const user = await db.collection('users').findOne({ _id: new ObjectId(auth.userId) });

    return NextResponse.json(user?.wishlist || []);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthFromCookie();
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { wishlist } = await request.json();
    if (!Array.isArray(wishlist)) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });

    const db = await getDb();
    await db.collection('users').updateOne(
      { _id: new ObjectId(auth.userId) },
      { $set: { wishlist } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Wishlist sync error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
