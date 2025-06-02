"use server";

import { getSession } from "@/app/(auth)/lib/session";
import { permission_form_schema, FormState } from "../_types/form-permission";
import { BE_URL } from "@/app/(auth)/_constants/url";

export async function Permissioncreate(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const validationFields = permission_form_schema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });
  if (!validationFields.success) {
    return { error: validationFields.error.flatten().fieldErrors };
  }

  const session = await getSession();

  if (!session || !session.user || !session.accessToken) {
    return { success: false, message: "Người dùng chưa đăng nhập" };
  }

  const formDataObject = {
    name: formData.get("name"),
    description: formData.get("description"),
  };

  try {
    const response = await fetch(`${BE_URL}/api/CreatePermission`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(formDataObject),
    });

    const responseBody = await response.text();

    if (!response.ok) {
      return {
        success: false,
        message: responseBody || "Lỗi không xác định từ API",
      };
    }

    return {
      success: true,
      message: "Thêm mới thành công",
    };
  } catch (error: any) {
    console.error("❌ Lỗi khi gọi API:", error);
    return {
      success: false,
      message: error?.message || "Lỗi không xác định khi gọi API",
    };
  }
}

// 🧩 Hàm lấy danh sách permission
export async function getPermissions({
  limit = 10,
  page = 1,
  sort = true,
  sortField = "",
}: {
  limit?: number;
  page?: number;
  sort?: boolean;
  sortField?: string;
}) {
  const session = await getSession();

  if (!session || !session.accessToken) {
    return { success: false, message: "Người dùng chưa đăng nhập" };
  }

  const query = new URLSearchParams({
    limit: limit.toString(),
    page: page.toString(),
    sort: sort.toString(),
    sortField: sortField,
  });

  try {
    const response = await fetch(`${BE_URL}/api/GetPermissions?${query}`, {
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
      data: result.permissions,
      totalDocuments: result.totalDocuments,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      sortField: result.sortField,
      sortOrder: result.sortOrder,
    };
  } catch (error: any) {
    console.error("❌ Lỗi khi gọi API getPermissions:", error);
    return { success: false, message: error?.message || "Lỗi không xác định" };
  }
}

export async function getPermissionById(id: string) {
  const session = await getSession();
  if (!session?.accessToken) {
    return { success: false, message: "Người dùng chưa đăng nhập" };
  }

  try {
    const response = await fetch(`${BE_URL}/api/GetPermission/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      return { success: false, message: text };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Lỗi không xác định khi lấy permission",
    };
  }
}
export async function PermissionUpdate(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const validationFields = permission_form_schema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!validationFields.success) {
    return { error: validationFields.error.flatten().fieldErrors };
  }

  const session = await getSession();
  if (!session || !session.user || !session.accessToken) {
    return { success: false, message: "Người dùng chưa đăng nhập" };
  }

  const id = formData.get("id");
  if (!id) {
    return { success: false, message: "ID không hợp lệ" };
  }

  const payload = {
    name: formData.get("name"),
    description: formData.get("description"),
  };

  try {
    const response = await fetch(`${BE_URL}/api/UpdatePermission/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();

    if (!response.ok) {
      return {
        success: false,
        message: responseText || "Lỗi cập nhật dữ liệu",
      };
    }

    return { success: true, message: "Cập nhật quyền thành công" };
  } catch (error: any) {
    console.error("❌ Lỗi khi cập nhật quyền:", error);
    return {
      success: false,
      message: error?.message || "Lỗi không xác định",
    };
  }
}
export async function PermissionDelete(id: string) {
  const session = await getSession();

  if (!session?.accessToken) {
    return { success: false, message: "Người dùng chưa đăng nhập" };
  }

  try {
      const response = await fetch(`${BE_URL}/api/DeletePermission/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    const text = await response.text();

    if (!response.ok) {
      console.error("❌ Phản hồi lỗi từ server:", text);
      return {
        success: false,
        message: text || "Lỗi khi xóa quyền",
      };
    }

    console.log("✅ Phản hồi thành công từ server:", text);
    return {
      success: true,
      message: "Xóa quyền thành công",
    };
  } catch (error: any) {
    console.error("❌ Lỗi khi xóa permission:", error);
    return {
      success: false,
      message: error?.message || "Lỗi không xác định khi xóa",
    };
  }
}
