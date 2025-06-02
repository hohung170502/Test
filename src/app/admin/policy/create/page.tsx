// app/admin/Policy/create/page.tsx
"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { Label } from "@/components/ui/label";
import { createPolicy } from "../_services/policy";
import { Textarea } from "@/components/ui/textarea";
import { getPermissions } from "../../permission/_services/permission";

export default function CreatePolicyPage() {
  const [state, action] = useActionState(createPolicy, undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const [permissions, setPermissions] = useState<any[]>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sortOrder, setSortOrder] = useState(true);
  const [sortField, setSortField] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchPermissions = async () => {
      setLoading(true);
      try {
        const response = await getPermissions({
          limit: pageSize,
          page: pageIndex,
          sort: sortOrder,
          sortField,
        });

        if (response.success) {
          setPermissions(response.data || []);
          setTotalPages(response.totalPages || 0);
        } else {
          toast.error("Lỗi khi tải danh sách quyền: " + response.message);
        }
      } catch (error) {
        console.error("❌ Lỗi khi gọi API getPermissions:", error);
        toast.error("❌ Có lỗi xảy ra khi tải danh sách quyền.");
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [pageIndex, pageSize, sortOrder, sortField]);
  useEffect(() => {
    if (state?.success) {
      toast.success(state.message || "Tạo chính sách thành công");
      router.push("/admin/policies"); // hoặc redirect về danh sách
    } else if (state?.message && !state.success) {
      toast.error(state.message);
    }
  }, [state, router]);
  return (
    <div className="px-4 ">
      <div className="pb-5 flex items-center min-h-[40px] space-x-4">
        <Link
          href="/admin/policy"
          className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 transition-all"
        >
          <span className="flex items-center justify-center w-6 h-6">
            <RightBack />
          </span>
        </Link>
        <div className="">
          <h2 className="text-xl font-semibold text-gray-900">
            Thêm nhóm admin
          </h2>
        </div>
        <div className="w-full flex justify-end md:hidden">
          <button
            type="submit"
            form="brand-form"
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
          >
            {isSubmitting ? "Đang xử lý..." : "Cập nhật"}
          </button>
        </div>
      </div>

      <form
        action={action}
        className="border p-6 bg-white shadow-lg rounded-lg space-y-6"
      >
        <div className="md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">
              Tên chính sách <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              className="hover:border-blue-500 focus:border-blue-500"
              required
            />
            {state?.error?.name && (
              <p className="text-sm text-red-500">{state.error.name}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Mô tả</Label>
          <Textarea
            id="description"
            name="description"
            rows={3}
            className="w-full p-2 border rounded-md hover:border-blue-500 focus:border-blue-500"
            placeholder="Nhập mô tả cho chính sách"
          ></Textarea>
          {state?.error?.description && (
            <p className="text-sm text-red-500">{state.error.description}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between pt-4 pb-3">
            <h3 className="font-medium">Danh sách quyền quản trị</h3>
            <div className="flex gap-4">
              <button className="text-blue-500 hover:underline">
                Chọn tất cả
              </button>
            </div>
          </div>
          {/* Chọn quyền */}
          <div className="border-b my-1" /> {/* Đường phân cách */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto  p-3 rounded-md">
            {permissions.map((perm, index) => (
              <label key={perm._id || index} className="flex items-center gap-2">
                <input type="checkbox" name="permissionIds" value={perm._id} />
                <span>{perm.name}</span>
              </label>
            ))}
          </div>
          {state?.error?.permissions && (
            <p className="text-sm text-red-500">{state.error.permissions}</p>
          )}
        </div>

        <div className="justify-end mt-6 space-x-4 hidden md:flex">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang xử lý..." : "Cập nhật"}
          </button>
        </div>
      </form>
    </div>
  );
}

function RightBack(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 20 20" className="w-6 h-6 text-gray-700">
      <path
        fill="currentColor"
        d="M16.667 9.167h-10.142l2.983-2.992-1.175-1.175-5 5 5 5 1.175-1.175-2.983-2.992h10.142z"
      ></path>
    </svg>
  );
}
