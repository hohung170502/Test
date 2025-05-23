import { refreshToken } from '../_services/auth';
import { getSession } from './session';

export interface AuthFetchOptions extends RequestInit {
  headers?: Record<string, string>;
}
export const authFetch = async (
  url: string | URL,
  options: AuthFetchOptions = {}
) => {
  const session = await getSession();
  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${session?.accessToken}`,
  };
  let res = await fetch(url, options);
  // console.log('authFetch', res.status);
  if (res.status === 401) {
    if (!session?.refreshToken) throw new Error('Refresh token not found');
    const newAccessToken = await refreshToken(session.refreshToken);
    // console.log('newAccessToken', newAccessToken);
    if (newAccessToken) {
      options.headers.Authorization = `Bearer ${newAccessToken}`;
      res = await fetch(url, options);
    }
  }
  return res;
};
