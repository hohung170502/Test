"use server";
import { BE_URL } from "@/app/(auth)/_constants/url";
import { getSession } from "@/app/(auth)/lib/session";
import {
  change_password_form_schema,
  FormState,
  profile_form_schema,
} from "@/app/admin/profile/_types/profile-state";
import { redirect } from "next/navigation";

export async function getProfile(): Promise<FormState> {
  // Lấy session và access token
  const session = await getSession();
  // console.log("Session:", session);

  if (!session || !session.user || !session.accessToken) {
    return { success: false, message: "Người dùng chưa đăng nhập" };
  }

  // Gọi API GET /profile/me
  const res = await fetch(`${BE_URL}/profile/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  // console.log("Response status:", res.status);

  if (res.ok) {
    const profileData = await res.json();
    // console.log("Raw profile data from API:", profileData);
    return {
      success: true,
      message: "",
      data: {
        email: profileData.data?.email ,
        avatar: profileData.data?.avatar ,
        username: profileData.data?.username ,
        phonenumber: profileData.data?.phonenumber ,
        address: profileData.data?.address ,
        gender: profileData.data?.gender ,
        birthday: profileData.data?.birthday ,
      },
    };
  } else {
    const errorData = await res.json();
    console.error("Error fetching profile:", errorData);
    return {
      success: false,
      error: errorData,
      message:
        res.status === 401 ? "Phiên đăng nhập không hợp lệ" : res.statusText,
    };
  }
}

export async function updateProfile(formData: FormData): Promise<FormState> {
  // Check if formData is a valid FormData object
  if (!(formData instanceof FormData)) {
    console.error("Invalid formData object passed to updateProfile:", formData);
    return { success: false, message: "Invalid formData object" };
  }

  const validationFields = profile_form_schema.safeParse({
    username: formData.get("username"),
    phonenumber: formData.get("phonenumber"),
    address: formData.get("address"),
    gender: formData.get("gender"),
    birthday: formData.get("birthday"),
  });
  if (!validationFields.success) {
    return { error: validationFields.error.flatten().fieldErrors };
  }

  // Lấy session và access token
  const session = await getSession();

  if (!session || !session.user || !session.accessToken) {
    return { success: false, message: "Người dùng chưa đăng nhập" };
  }

  const gender = formData.get("gender")?.toString();
  if (!gender || !["male", "female", "other"].includes(gender)) {
    return { success: false, message: "Giới tính không hợp lệ" };
  }

  // Tạo payload từ formData
  const payload = {
    username: formData.get("username"),
    phonenumber: formData.get("phonenumber"),
    address: formData.get("address"),
    gender: formData.get("gender"),
    birthday: formData.get("birthday"),
  };

  try {
    // Gọi API PUT /profile/me
    const res = await fetch(`${BE_URL}/profile/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      return { success: true, message: "Cập nhật thông tin thành công" };
    } else {
      const errorText = await res.text();
      return {
        success: false,
        message:
          res.status === 401
            ? "Sai tài khoản hoặc hết phiên đăng nhập"
            : errorText,
      };
    }
  } catch (error: any) {
    console.error("❌ Lỗi khi gọi API cập nhật thông tin người dùng:", error);
    return {
      success: false,
      message: error?.message || "Lỗi không xác định khi gọi API",
    };
  }
}

export async function changePassword(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const validationFields = change_password_form_schema.safeParse({
    oldPassword: formData.get("oldPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!validationFields.success) {
    return { error: validationFields.error.flatten().fieldErrors };
  }

  const session = await getSession();

  if (!session || !session.user || !session.accessToken) {
    return { success: false, message: "Người dùng chưa đăng nhập" };
  }

  const formDataObject = {
    oldPassword: formData.get("oldPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  };

  try {
    const response = await fetch(`${BE_URL}/profile/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(formDataObject),
    });

    if (response.status === 201) {
      return { success: true, message: "Đổi mật khẩu thành công" };
    } else {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "Đổi mật khẩu thất bại",
        error: errorData,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Lỗi khi gọi API đổi mật khẩu",
    };
  }
}

export async function uploadAvatar(file: File): Promise<FormState> {
  const session = await getSession();

  if (!session || !session.user || !session.accessToken) {
    return { success: false, message: "Người dùng chưa đăng nhập" };
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${BE_URL}/profile/avatar`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: formData,
    });

    if (response.status === 201) {
      return { success: true, message: "Cập nhật ảnh đại diện thành công" };
    } else {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "Cập nhật ảnh đại diện thất bại",
        error: errorData,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Lỗi khi gọi API cập nhật avatar",
    };
  }
}

