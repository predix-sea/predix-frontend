import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/** Routes that never require auth (browse-first; no login redirect in middleware). */
function isPublicPath(pathname: string): boolean {
  if (pathname === '/') return true;
  return (
    pathname.startsWith('/login') ||
    pathname.startsWith('/compliance-blocked') ||
    pathname.startsWith('/api')
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
