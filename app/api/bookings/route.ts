import { getDb } from '@/lib/db';
import { getAuthFromCookie } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { bookingSchema } from '@/lib/validation';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthFromCookie();

    if (!auth) {
      return NextResponse.json(
        { error: 'Authentication required to create a booking' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate request body
    const validationResult = bookingSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid booking data', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const db = await getDb();
    const bookingsCollection = db.collection('bookings');

    const booking = {
      ...validationResult.data,
      userId: auth.userId,
      status: 'confirmed',
      createdAt: new Date(),
    };

    const result = await bookingsCollection.insertOne(booking);

    return NextResponse.json({
      _id: result.insertedId.toString(),
      ...booking,
    });
  } catch (error) {
    logger.error('Booking creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthFromCookie();

    if (!auth || auth.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin credentials required.' },
        { status: 401 }
      );
    }

    const db = await getDb();
    const bookingsCollection = db.collection('bookings');
    const bookings = await bookingsCollection.find({}).toArray();

    return NextResponse.json(
      bookings.map((booking) => ({
        ...booking,
        _id: booking._id.toString(),
      }))
    );
  } catch (error) {
    logger.error('Fetch bookings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

