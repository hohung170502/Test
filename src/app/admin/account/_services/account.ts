"use server";

import { BE_URL } from "@/app/(auth)/_constants/url";
import { getSession } from "@/app/(auth)/lib/session";


export async function getUsers({
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
    const response = await fetch(`${BE_URL}/api/GetAllUsers?${query}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const text = await response.text();
      return { success: false, message: text };
    }

    const result = await response.json();

    return {
      success: true,
      data: result.data?.users,
      totalDocuments: result.data?.totalDocuments,
      totalPages: result.data?.totalPages,
      currentPage: result.data?.currentPage,
      sortField: result.data?.sortField,
      sortOrder: result.data?.sortOrder,
    };
  } catch (error: any) {
    console.error("❌ Lỗi khi gọi API getUsers:", error);
    return { success: false, message: error?.message || "Lỗi không xác định" };
  }
}



export async function getUsersById(id: string) {
  const session = await getSession();
  if (!session?.accessToken) {
    return { success: false, message: "Người dùng chưa đăng nhập" };
  }

  try {
    const response = await fetch(`${BE_URL}/api/GetUser/${id}`, {
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