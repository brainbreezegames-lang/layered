import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add CSP header to allow eval in development (needed for Next.js)
  if (process.env.NODE_ENV === 'development') {
    response.headers.set(
      'Content-Security-Policy',
      "script-src 'self' 'unsafe-eval' 'unsafe-inline';"
    );
  }

  return response;
}

export const config = {
  matcher: '/:path*',
};
