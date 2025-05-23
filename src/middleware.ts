import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from './app/(auth)/lib/session';

// This function can be marked `async` if using `await` inside
export default async function middleware(req: NextRequest) {
  const session = await getSession();
  if (!session || !session.user) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }
  NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/profile'],
};
