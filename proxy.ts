import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // CSRF Protection for API routes
  if (pathname.startsWith('/api/') && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');

    // In production, ensure the request comes from the same origin
    if (process.env.NODE_ENV === 'production') {
      if (!origin || !host || !origin.includes(host)) {
        return NextResponse.json(
          { error: 'Invalid origin. Possible CSRF attack detected.' },
          { status: 403 }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
