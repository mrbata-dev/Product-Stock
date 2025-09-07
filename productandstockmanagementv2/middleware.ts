import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  console.log('Token:', token);
  
  const url = request.nextUrl.clone();


  if (!token && url.pathname.startsWith('/dashboard')) {
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }


  if (token && (url.pathname === '/auth/login' || url.pathname === '/auth/signup')) {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }
 // Role-based access control for dashboard
  if (token && url.pathname.startsWith('/dashboard')) {
    const allowedRoles = ['ADMIN', 'MANAGER', 'STAFF'];
    if (!allowedRoles.includes(token.role)) {

      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/auth/login',
    '/auth/signup',
    '/dashboard/:path*'
  ],
};
