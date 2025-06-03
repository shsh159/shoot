// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  // 로그인 필요 경로만 필터링
  const protectedRoutes = ['/dashboard', '/list'];

  const isProtectedPath = protectedRoutes.some((path) =>
    pathname.startsWith(path),
  );

  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}
