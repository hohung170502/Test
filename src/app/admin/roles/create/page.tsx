// app/admin/Policy/create/page.tsx
"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { createRoles } from "../_services/roles";
import { Textarea } from "@/components/ui/textarea";

export default function CreateRolesPage() {
  const [state, action] = useActionState(createRoles, undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [policies, setPolicies] = useState<any[]>([]);

  const router = useRouter();

  //   useEffect(() => {
  //     const fetchPosetPolicies = async () => {
  //       try {
  //         const res = await getPolicies({ pageIndex: 1, pageSize: 100 });
  //         if (res.success && Array.isArray(res.data)) {
  //           setPolicies(res.data);
  //         }
  //       } catch (error) {
  //         toast.error("Không thể tải danh sách quyền.");
  //         console.error(error);
  //       }
  //     };
  //     fetchPosetPolicies();
  //   }, []);
  //   useEffect(() => {
  //     if (state?.success) {
  //       toast.success(state.message || "Tạo chính sách thành công");
  //       router.push("/admin/roles"); // hoặc redirect về danh sách
  //     } else if (state?.message && !state.success) {
  //       toast.error(state.message);
  //     }
  //   }, [state, router]);
  return (
    <div className="px-4 ">
      <div className="pb-5 flex items-center min-h-[40px] space-x-4">
        <Link
          href="/admin/roles"
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
        <div className="grid grid-cols-1  gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">
              Tên nhóm <span className="text-red-500">*</span>
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
          <div className="space-y-2 ">
            <Label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Mô tả
            </Label>
            <Textarea id="description" name="description" placeholder="" />
            {/* {state?.error?.sort && (
              <p className="text-sm text-red-500">{state.error.sort}</p>
            )} */}
          </div>
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
            {policies.map((perm) => (
              <Label key={perm.id} className="flex items-center gap-2">
                <Input
                  type="checkbox"
                  name="policyIds"
                  className="w-4 h-4"
                  value={perm.id}
                />
                <span>{perm.name}</span>
              </Label>
            ))}
          </div>
          {/* {state?.error?.policyIds && (
            <p className="text-sm text-red-500">{state.error.policyIds}</p>
          )} */}
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
