import { getDb } from '@/lib/db';
import { hashPassword, setAuthCookie } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { registerSchema } from '@/lib/validation';
import { logger } from '@/lib/logger';
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Basic rate limiting by IP
    const ip = request.headers.get('x-forwarded-for') || (request as any).ip || '127.0.0.1';
    const limiter = rateLimit(ip, 5, 3600000); // 5 registrations per hour

    if (!limiter.success) {
      logger.warn('Rate limit exceeded for registration', { ip });
      return rateLimitResponse();
    }

    const body = await request.json();

    // Validate request body
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid registration data', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { username, email, password, phone } = validationResult.data;

    const db = await getDb();
    const usersCollection = db.collection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username or email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const result = await usersCollection.insertOne({
      username,
      email,
      password: hashedPassword,
      phone: phone || '',
      address: '',
      role: 'user',
      createdAt: new Date(),
    });

    const user = {
      _id: result.insertedId.toString(),
      username,
      email,
      phone: phone || '',
      role: 'user' as const,
    };

    // Set auth cookie
    await setAuthCookie({
      userId: user._id,
      username,
      role: 'user',
    });

    logger.info('User registered successfully', { username });

    return NextResponse.json(user);
  } catch (error) {
    logger.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}
