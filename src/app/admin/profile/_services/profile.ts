"use server";
import { BE_URL } from "@/app/(auth)/_constants/url";
import { getSession } from "@/app/(auth)/lib/session";
import {
  FormState,
  profile_form_schema
} from "@/app/admin/profile/_types/profile-state";
import { redirect } from "next/navigation";

export async function profile(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  // Lấy session và access token
  const session = await getSession();

  if (!session || !session.user || !session.accessToken) {
    return { success: false, message: "Người dùng chưa đăng nhập" };
  }

  // Gọi API GET /profile/me
  const res = await fetch(`${BE_URL}/profile/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session.accessToken}`,
    },
  });

  if (res.ok) {
    const profileData = await res.json();
    return { success: true, message: "", data: profileData };
  } else {
    return {
      success: false,
      error: {},
      message: res.status === 401 ? "Sai tài khoản hoặc mật khẩu" : res.statusText,
    };
  }
}