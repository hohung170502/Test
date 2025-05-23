'use server';
import {
  FormState,
  signin_form_schema,
  signup_form_schema,
} from '@/app/(auth)/_types/form-state';
import { BE_URL } from '../_constants/url';
import { redirect } from 'next/navigation';
import { createSession, updateToken } from '../lib/session';
import { authFetch } from '../lib/authFetch';

export async function signup(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const validationFields = signup_form_schema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!validationFields.success) {
    return {
      error: validationFields.error.flatten().fieldErrors,
    };
  }
  // Đăng ký tài khoản
  const res = await fetch(`${BE_URL}/mutiple-auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(validationFields.data),
  });
  const responseData = await res.json();

  if (res.status === 201) {
  // Gửi email xác thực
  await fetch(`${BE_URL}/mutiple-auth/send-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: validationFields.data.email }),
  });

  return {
    success: true,
    message: "Email đã được gửi. Vui lòng xác minh tài khoản.",
    redirectTo: "/verify-code?email=" + encodeURIComponent(validationFields.data.email),
  };
} else {
    return {
      success: false,
      message: responseData.message || "Email đã tồn tại",
    };
  }
}

export async function signin(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const validationFields = signin_form_schema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!validationFields.success) {
    return {
      error: validationFields.error.flatten().fieldErrors,
    };
  }
  const res = await fetch(`${BE_URL}/mutiple-auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(validationFields.data),
  });

  if (res.ok) {
  const result = await res.json();
  await createSession({
    user: {
      email: result.email,
      username: result.username,
      avatar: result.avatar,
      roles: result.roles,
      verified: result.verified,
    },
    accessToken: result.accessToken,
    refreshToken: '',
  });
  redirect('/');
} else
  return {
    message: res.status === 401 ? 'Invalid Credentials' : res.statusText,
  };
}

export async function refreshToken(oldRefreshToken: string) {
  try {
    const res = await fetch(`${BE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: oldRefreshToken }),
    });
    // console.log(res);
    if (!res.ok)
      throw new Error('Failed to refresh token at auth.ts' + res.statusText);
    const { accessToken, refreshToken } = await res.json();

    // update token
    // await updateToken({ accessToken, refreshToken });
    const updateToken = await fetch(`http://localhost:3000/api/auth/update`, {
      method: 'POST',
      body: JSON.stringify({ accessToken, refreshToken }),
    });
    if (!updateToken.ok) throw new Error('failed to update the token');
    return accessToken;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getUserById(id: string, accessToken: string) {
  const res = await fetch(`${BE_URL}/api/GetUser/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) throw new Error('Không lấy được thông tin user');
  return res.json();
}

export async function verifyCode(email: string, code: string) {
  const res = await fetch(`${BE_URL}/mutiple-auth/verify-code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, code }),
  });
  const data = await res.json();
  if (res.ok) {
    // Xác thực thành công, trả về user + token
    return { success: true, data };
  } else {
    return { success: false, message: data.message || "Mã xác thực không đúng!" };
  }
}