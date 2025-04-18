import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import type { NextRequest } from 'next/server';

export default auth((req: NextRequest & { auth: any }) => {
  const isLoggedIn = !!req.auth;
  const isEditor = req.auth?.user?.role === 'editor';
  const isAdmin = req.auth?.user?.role === 'admin';

  // Protect editor routes
  if (req.nextUrl.pathname.startsWith('/editor') && !isEditor) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Protect admin routes
  if (req.nextUrl.pathname.startsWith('/admin') && !isAdmin) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/editor/:path*', '/admin/:path*'],
}; 