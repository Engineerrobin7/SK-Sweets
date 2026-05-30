import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // This is where you would integrate with Mailchimp/ConvertKit
    // For now, we simulate a successful subscription
    logger.info('New newsletter subscription:', { email });

    return NextResponse.json({ success: true, message: 'Welcome to the Royal Club!' });
  } catch (error) {
    logger.error('Newsletter subscription error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
