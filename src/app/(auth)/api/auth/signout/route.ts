'use server';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { deleteSession, getSession } from '@/app/(auth)/lib/session';
import { BE_URL } from '@/app/(auth)/_constants/url';

export async function GET(req: NextRequest) {
  // Lấy session để lấy accessToken
  const session = await getSession();
  const accessToken = session?.accessToken;

  // Gửi request logout với Authorization header
  const res = await fetch(`${BE_URL}/mutiple-auth/logout`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'accept': 'application/json',
    },
  });

  // Xóa session phía client nếu logout thành công
  if (res.ok) {
    await deleteSession();
  }

  revalidatePath('/login');
  return NextResponse.redirect(new URL('/login', req.nextUrl));
}