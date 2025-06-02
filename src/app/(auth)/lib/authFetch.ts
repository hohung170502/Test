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
    throw new Error('Access token is invalid or expired');
  }
  return res;
};
