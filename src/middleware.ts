import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith('/portal')) return NextResponse.next();
  // Temporarily allow unauthenticated access to chat UI while APIs/auth are not ready
  if (pathname === '/portal/chat' || pathname.startsWith('/portal/chat/')) {
    return NextResponse.next();
  }

  const cookieToken = req.cookies.get('auth_token')?.value;
  const roleCookie = req.cookies.get('user_role')?.value;
  if (!cookieToken) {
    const url = new URL('/login', req.url);
    url.searchParams.set('callbackUrl', req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(url);
  }
  // Role-based auto redirect for portal index
  if (pathname === '/portal' || pathname === '/portal/') {
    if (roleCookie) {
      const role = roleCookie.toUpperCase();
      const dest = role === 'PROFESSIONAL' ? '/portal/professional' : '/portal/patient';
      if (req.nextUrl.pathname !== dest) {
        const url = new URL(dest, req.url);
        return NextResponse.redirect(url);
      }
    }
    return NextResponse.next();
  }

  // Role guards for specific dashboards (best-effort using cookie)
  if (pathname.startsWith('/portal/patient')) {
    if (roleCookie && roleCookie.toUpperCase() === 'PROFESSIONAL') {
      return NextResponse.redirect(new URL('/portal/professional', req.url));
    }
  }
  if (pathname.startsWith('/portal/professional')) {
    if (roleCookie && roleCookie.toUpperCase() === 'PATIENT') {
      return NextResponse.redirect(new URL('/portal/patient', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/portal/:path*'],
};
