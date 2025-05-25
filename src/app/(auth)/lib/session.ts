'use server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { jwtVerify, SignJWT } from 'jose';

export type Session = {
  user: {
    email: string;
    username: string;
    avatar: string;
    roles?: string[];
    verified: boolean;
  };
  accessToken: string;
  refreshToken: string;
};

const secret_key = process.env.SESSION_SECRET_KEY!;
const endcodeKey = new TextEncoder().encode(secret_key);
export async function createSession(payload: Session) {
  const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await new SignJWT(payload)
    .setProtectedHeader({
      alg: 'HS256',
    })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(endcodeKey);
  const cookie = await cookies();
  cookie.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiredAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSession() {
  const cookie = (await cookies()).get('session')?.value;
  if (!cookie) return null;
  try {
    const { payload } = await jwtVerify(cookie, endcodeKey, {
      algorithms: ['HS256'],
    });
    return payload as Session;
  } catch (error) {
    console.error('Failed to get session', error);
    redirect('/login');
  }
}

export async function deleteSession() {
  (await cookies()).delete('session');
}

export async function updateToken({}: {
  accessToken: string;
  refreshToken: string;
}) {
  const cookie = (await cookies()).get('session')?.value;
  if (!cookie) return null;
  const { payload } = await jwtVerify<Session>(cookie, endcodeKey);
  if (!payload) throw new Error('Failed to get session');
  const newPayload: Session = {
    user: {
      ...payload.user,
    },
    accessToken: payload.accessToken,
    refreshToken: "",
  };
  await createSession(newPayload);
}
