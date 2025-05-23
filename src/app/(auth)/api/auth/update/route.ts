import { updateToken } from '@/app/(auth)/lib/session';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { accessToken, refreshToken } = body;
  if (!accessToken && !refreshToken)
    return new Response('provide', { status: 400 });
  await updateToken({ accessToken, refreshToken });
  return new Response('ok', { status: 200 });
}
