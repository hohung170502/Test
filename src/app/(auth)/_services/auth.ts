"use server";
import {
  FormState,
  resend_code_form_schema,
  signin_form_schema,
  signup_form_schema,
  verify_code_form_schema,
  forgot_password_form_schema,
  reset_password_form_schema,
} from "@/app/(auth)/_types/form-state";
import { BE_URL } from "../_constants/url";
import { redirect } from "next/navigation";
import { createSession, getSession, deleteSession } from "../lib/session";

export async function signup(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const validationFields = signup_form_schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!validationFields.success) {
    return {
      error: validationFields.error.flatten().fieldErrors,
    };
  }
  // Đăng ký tài khoản
  const res = await fetch(`${BE_URL}/mutiple-auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validationFields.data),
  });
  const responseData = await res.json();

  if (res.status === 201) {
    // Gửi email xác thực
    await fetch(`${BE_URL}/mutiple-auth/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: validationFields.data.email }),
    });

    return {
      success: true,
      message: "Email đã được gửi. Vui lòng xác minh tài khoản.",
      redirectTo:
        "/verify-code?email=" + encodeURIComponent(validationFields.data.email),
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
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!validationFields.success) {
    return {
      error: validationFields.error.flatten().fieldErrors,
    };
  }
  const res = await fetch(`${BE_URL}/mutiple-auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validationFields.data),
  });

  // console.log("Response status:", res.status);

  if (res.ok) {
    const result = await res.json();
    // console.log("API result:", result);

    const payload = {
      user: {
        email: result.data.email,
        username: result.data.username,
        avatar: result.data.avatar,
        roles: result.data.roles,
        verified: result.data.verified,
      },
      accessToken: result.data.accessToken,
    };

    await createSession(payload);
    // console.log("Session payload:", payload);

    return { success: true, message: "Đăng nhập thành công." };
  } else {
    console.log("Error response:", await res.text());
    return {
      success: false,
      error: {
        email: res.status === 401 ? ["Invalid Credentials"] : [],
        password: res.status === 401 ? ["Invalid Credentials"] : [],
      },
      message: res.status === 401 ? "Sai tài khoản hoặc mật khẩu" : res.statusText,
    };
  }
}

export async function getUserById(id: string, accessToken: string) {
  const res = await fetch(`${BE_URL}/api/GetUser/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) throw new Error("Không lấy được thông tin user");
  return res.json();
}

export async function verifyCode(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const validationFields = verify_code_form_schema.safeParse({
    email: formData.get("email"),
    code: formData.get("code"),
  });
  if (!validationFields.success) {
    return {
      error: validationFields.error.flatten().fieldErrors,
    };
  }
  const res = await fetch(`${BE_URL}/mutiple-auth/verify-code`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validationFields.data),
  });

  if (res.ok) {
    const result = await res.json();

    redirect("/");
  } else
    return {
      message: res.status === 401 ? "Invalid Credentials" : res.statusText,
    };
}

export async function resendVerifyCode(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const validationFields = resend_code_form_schema.safeParse({
    email: formData.get("email"),
  });
  if (!validationFields.success) {
    return {
      error: validationFields.error.flatten().fieldErrors,
    };
  }
  const res = await fetch(`${BE_URL}/mutiple-auth/resend-code`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validationFields.data),
  });

  if (res.ok) {
   return { success: true, message: "Đã gửi lại mã xác thực về email." };

    redirect("/");
  } else
    return { success: false, message: "Có lỗi xảy ra khi gửi lại mã xác thực." };
}

export async function forgotPassword(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const validationFields = forgot_password_form_schema.safeParse({
    email: formData.get("email"),
  });

  if (!validationFields.success) {
    return {
      error: {
        email: validationFields.error.flatten().fieldErrors.email,
      },
    };
  }

  try {
    const res = await fetch(`${BE_URL}/profile/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validationFields.data),
    });

    if (res.ok) {
      const result = await res.json();
      return {
        success: true,
        message: result.message,
        redirectTo: result.resetLink, // Sử dụng liên kết đặt lại mật khẩu từ backend
      };
    } else {
      const errorResponse = await res.json();
      return {
        success: false,
        message: errorResponse.message || res.statusText,
      };
    }
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return {
      success: false,
      message: "An error occurred while processing your request.",
    };
  }
}

export async function resetPassword(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const validationFields = reset_password_form_schema.safeParse({
    token: formData.get("token"),
    newPassword: formData.get("newPassword"),
  });

  if (!validationFields.success) {
    return {
      error: {

        email: validationFields.error.flatten().fieldErrors.token,
        password: validationFields.error.flatten().fieldErrors.newPassword,
      },
    };
  }

  try {
    const res = await fetch(`${BE_URL}/profile/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validationFields.data),
    });

    if (res.ok) {
      const result = await res.json();
      return {
        success: true,
        message: result.message || "Mật khẩu đã được thay đổi thành công.",
      };
    } else {
      const errorResponse = await res.json();
      return {
        success: false,
        message: errorResponse.message || res.statusText,
      };
    }
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return {
      success: false,
      message: "Đã xảy ra lỗi khi xử lý yêu cầu của bạn.",
    };
  }
}

export async function logout(): Promise<{ success: boolean; message: string }> {
  const session = await getSession();
  const accessToken = session?.accessToken;

  if (!accessToken) {
    await deleteSession();
    return { success: false, message: "Không tìm thấy accessToken hoặc đã hết hạn." };
  }

  const res = await fetch(`${BE_URL}/mutiple-auth/logout`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (res.ok) {
    await deleteSession();
    return { success: true, message: "Đăng xuất thành công." };
  } else {
    const errorResponse = await res.json();
    console.error("Logout failed:", errorResponse);
    return { success: false, message: errorResponse.message || "Đăng xuất thất bại." };
  }
}
