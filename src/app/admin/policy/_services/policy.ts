"use server";
import { getSession } from "@/app/(auth)/lib/session";
import { BE_URL } from "@/app/(auth)/_constants/url";
import { FormState, policies_form_schema } from "../_types/form-policy";

export async function createPolicy(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const validationFields = policies_form_schema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    permissions: formData.getAll("permissionIds"),
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

  const formDataObject = {
    name: formData.get("name"),
    description: formData.get("description"),
    permissions: formData.getAll("permissionIds").map((id) => id.toString()),
  };
  console.log("📦 Payload gửi API:", formDataObject);
  try {
    const response = await fetch(`${BE_URL}/api/CreatePolicy`, {
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
    console.error("❌ Lỗi khi gọi API thêm chính sách:", error);
    return {
      success: false,
      message: error?.message || "Lỗi không xác định khi gọi API",
    };
  }
}

export async function getPolicies({
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
    const response = await fetch(`${BE_URL}/api/GetPolicies?${query}`, {
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
      policies: result.policies, // Sử dụng đúng trường policies từ API
      totalDocuments: result.totalDocuments, // Sử dụng đúng trường totalDocuments từ API
    };
  } catch (error: any) {
    console.error("❌ Lỗi khi gọi API getPolicies:", error);
    return { success: false, message: error?.message || "Lỗi không xác định" };
  }
}

export async function updatePolicy(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const id = formData.get("id")?.toString(); // Lấy id từ FormData

  const validationFields = policies_form_schema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    sort: formData.get("sort"),
    permissionIds: formData.getAll("permissionIds"),
  });

  if (!validationFields.success) {
    console.log("❌ Validation error:", validationFields.error.flatten().fieldErrors);
    return { error: validationFields.error.flatten().fieldErrors };
  }

  const session = await getSession();

  if (!session || !session.user || !session.accessToken) {
    return { success: false, message: "Người dùng chưa đăng nhập" };
  }

  const formDataObject = {
    name: formData.get("name"),
    description: formData.get("description"),
    sort: parseInt(formData.get("sort")?.toString() || "0", 10),
    permissionIds: formData.getAll("permissionIds").map((id) => id.toString()),
  };

  
  try {
    const response = await fetch(`${BE_URL}/api/Account/Policies/${id}`, {
      method: "PUT",
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
        message: responseBody || "Lỗi không xác định từ API khi cập nhật",
      };
    }

    return {
      success: true,
      message: "Cập nhật chính sách thành công",
    };
  } catch (error: any) {
    console.error("Lỗi khi gọi API cập nhật chính sách:", error);
    return {
      success: false,
      message: error?.message || "Lỗi không xác định khi gọi API",
    };
  }
}


export async function getPolicyDetail(id: string, isDeep = true) {
  const session = await getSession();

  if (!session || !session.accessToken) {
    return { success: false, message: "Người dùng chưa đăng nhập" };
  }

  try {
    const response = await fetch(`${BE_URL}/api/Account/Policies/${id}?isDeep=${isDeep}`, {
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

export async function deletePolicy(id: string) {
  const session = await getSession();

  if (!session || !session.accessToken) {
    return { success: false, message: "Người dùng chưa đăng nhập" };
  }

  try {
    const response = await fetch(`${BE_URL}/api/Account/Policies/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    const responseText = await response.text();

    if (!response.ok) {
      return {
        success: false,
        message: responseText || "Lỗi khi xóa chính sách",
      };
    }

    return {
      success: true,
      message: "Xóa chính sách thành công",
    };
  } catch (error: any) {
    console.error("❌ Lỗi khi gọi API xóa chính sách:", error);
    return {
      success: false,
      message: error?.message || "Lỗi không xác định khi gọi API",
    };
  }
}
