import { getDb } from '@/lib/db';
import { verifyPassword, setAuthCookie } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validation';
import { logger } from '@/lib/logger';
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Basic rate limiting by IP
    const ip = request.headers.get('x-forwarded-for') || (request as any).ip || '127.0.0.1';
    const limiter = rateLimit(ip, 10, 60000); // 10 attempts per minute

    if (!limiter.success) {
      logger.warn('Rate limit exceeded for login', { ip });
      return rateLimitResponse();
    }

    const body = await request.json();

    // Validate request body
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid login credentials' },
        { status: 400 }
      );
    }

    const { username, password } = validationResult.data;

    const db = await getDb();
    const usersCollection = db.collection('users');

    // Find user
    const user = await usersCollection.findOne({ username });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const userResponse = {
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
    };

    // Set auth cookie
    await setAuthCookie({
      userId: user._id.toString(),
      username: user.username,
      role: user.role,
    });

    logger.info('User logged in successfully', { username });

    return NextResponse.json(userResponse);
  } catch (error) {
    logger.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
}
