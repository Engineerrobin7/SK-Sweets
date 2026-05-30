import { getAuthFromCookie } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthFromCookie();

    if (!auth) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const db = await getDb();
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({
      _id: new ObjectId(auth.userId),
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userResponse = {
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
      role: user.role,
    };

    return NextResponse.json(userResponse);
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
