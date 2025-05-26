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

export async function updateAvatar(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  // Lấy session và access token
  const session = await getSession();

  if (!session || !session.user || !session.accessToken) {
    return { success: false, message: "Người dùng chưa đăng nhập" };
  }

  // Kiểm tra file ảnh
  const file = formData.get("file");
  if (!file || !(file instanceof Blob)) {
    return { success: false, message: "Vui lòng chọn file ảnh hợp lệ" };
  }

  // Tạo FormData mới để gửi lên BE
  const uploadData = new FormData();
  uploadData.append("file", file);

  // Gọi API POST /profile/avatar
  const res = await fetch(`${BE_URL}/profile/avatar`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${session.accessToken}`,
      // Không set Content-Type, để trình duyệt tự động set boundary cho multipart/form-data
    },
    body: uploadData,
  });

  if (res.ok) {
    return { success: true, message: "Cập nhật avatar thành công" };
  } else {
    return {
      success: false,
      error: {},
      message: res.status === 401 ? "Chưa đăng nhập hoặc hết phiên đăng nhập" : res.statusText,
    };
  }
}