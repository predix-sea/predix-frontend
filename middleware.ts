import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/** Public routes that skip auth redirect */
const PUBLIC = ['/login', '/compliance-blocked', '/api'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
