"use server";

import { BE_URL } from "@/app/(auth)/_constants/url";
import { getSession } from "@/app/(auth)/lib/session";
import { FormState, roles_form_schema } from "../_types/roles-state";

export async function createRoles(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  // 🧾 Parse FormData
 

  // ✅ Validate
  const validationFields = roles_form_schema.safeParse({
   name: formData.get("name"),
   description: formData.get("description"),
  });

  if (!validationFields.success) {
    console.log(
      "❌ Validation error:",
      validationFields.error.flatten().fieldErrors
    );
    return { error: validationFields.error.flatten().fieldErrors };
  }

  const session = await getSession();
  console.log("🔐 Session:", session);

  if (!session || !session.user || !session.accessToken) {
    return { success: false, message: "Người dùng chưa đăng nhập" };
  }

  // 📦 Chuẩn bị body gửi API
   const formDataObject = {
    name: formData.get("name"),
    description: formData.get("description"),
};

  try {
    const response = await fetch(`${BE_URL}/api/CreateRole`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(formDataObject),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log("❌ Lỗi từ API:", errorData);
      return {
        success: false,
        message: errorData.detail || "Tạo vai trò thất bại",
      };
    }

    const result = await response.json();
    console.log("✅ Tạo vai trò thành công:", result);

    return {
      success: true,
      message: "Tạo vai trò thành công!",
    };
  } catch (error) {
    console.error("🚨 Lỗi kết nối API:", error);
    return {
      success: false,
      message: "Đã xảy ra lỗi trong quá trình tạo vai trò.",
    };
  }
}



export async function getRoles({
  keyword = "",
  orderBy = "",
  isDescending = false,
  pageIndex = 1,
  pageSize = 10,
  isOutputTotal = true,
  isDeep = true,
}: {
  keyword?: string;
  orderBy?: string;
  isDescending?: boolean;
  pageIndex?: number;
  pageSize?: number;
  isOutputTotal?: boolean;
  isDeep?: boolean;
}) {
  const session = await getSession();

  if (!session || !session.accessToken) {
    return { success: false, message: "Người dùng chưa đăng nhập" };
  }

  const query = new URLSearchParams({
    PageIndex: pageIndex.toString(),
    PageSize: pageSize.toString(),
    Keyword: keyword,
    OrderBy: orderBy,
    IsDescending: isDescending.toString(),
    IsOutputTotal: "true",
    IsDeep: "true",
  });

  try {
    const response = await fetch(`${BE_URL}/api/Account/Roles?${query}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      return { success: false, message: text };
    }

    const result = await response.json();

    return {
      success: true,
      data: result.data,
      totalRecords: result.totalRecords,
    };
  } catch (error: any) {
    console.error("❌ Lỗi khi gọi API getRoles:", error);
    return { success: false, message: error?.message || "Lỗi không xác định" };
  }
}

export async function getRolesDetail(id: string, isDeep = true) {
  const session = await getSession();

  if (!session || !session.accessToken) {
    return { success: false, message: "Người dùng chưa đăng nhập" };
  }

  try {
    const response = await fetch(`${BE_URL}/api/Account/Roles/${id}?isDeep=${isDeep}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      return { success: false, message: text };
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: error?.message || "Lỗi không xác định khi gọi API" };
  }
}

export async function deleteRole(id: string) {
  const session = await getSession();
  if (!session || !session.accessToken) return { success: false };

  try {
    const response = await fetch(`${BE_URL}/api/Account/Roles/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      return { success: false, message: data.detail || "Xóa thất bại" };
    }

    return { success: true };
  } catch (error) {
    console.error("❌ API lỗi khi xóa:", error);
    return { success: false, message: "Lỗi kết nối máy chủ" };
  }
}