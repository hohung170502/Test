'use server';

import { BE_URL } from '../_constants/url';
import { authFetch } from './authFetch';
import { getSession } from './session';

export const getProfile = async () => {
  // const session = await getSession();
  // const res = await fetch(`${BE_URL}/api/auth/protected`, {
  //   headers: {
  //     authorization: `Bearer ${session?.accessToken}`,
  //   },
  // });

  const res = await authFetch(`${BE_URL}/api/auth/protected`);
  const result = await res.json();
  return result;
};
