"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Label } from "@/components/ui/label";

import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Permissioncreate } from "../_services/permission";

export default function PermissionCreateForm() {
    const [state, action] = useActionState(Permissioncreate, undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

    useEffect(() => {
      if (state) {
        if (state.success) {
          toast.success("Tạo quyền thành công");
          router.push("/admin/permission");
        } else if (state.message || state.error) {
          toast.error("Tạo quyền thất bại", {
            description: state.message || "Vui lòng kiểm tra lại thông tin",
          });
        }
        setIsSubmitting(false);
      }
    }, [state, router]);
  return (
    <div className="px-4">
      <div className="pb-5 flex items-center min-h-[40px] space-x-4">
        <Link
          href="/admin/permission"
          className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 transition-all"
        >
          <span className="flex items-center justify-center w-6 h-6">
            <RightBack />
          </span>
        </Link>
        <h2 className="text-xl font-semibold text-gray-900">Tạo quyền mới</h2>
        <div className=" ">
          {/* Dropdown - visible only on mobile */}
          <div className="relative right-0 mt-2 w-48 rounded-md p-4 z-10 space-y-2 md:hidden">
            <button
              type="submit"
              form="brand-form"
              className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
            >
              {isSubmitting ? "Đang xử lý..." : "Tạo quyền"}
            </button>
          </div>
        </div>
      </div>

      <form
        action={action}
        className="border p-6 bg-white shadow-lg rounded-lg"
      >
        {/* Input tạo quyền mới */}
        <div className="mb-4">
          <h3 className="font-bold mb-2">Thông tin quyền</h3>
        </div>
        <div className=" md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Tên quyền <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Nhập tên quyền"
              required
            />
            {/* {state?.error?.name && (
              <p className="text-sm text-red-500">{state.error.name}</p>
            )} */}
          </div>

          <div className="space-y-2 mt-2">
            <Label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Mô tả
            </Label>
            <Textarea id="description" name="description" placeholder="" />
            {state?.error?.description && (
              <p className="text-sm text-red-500">{state.error.description}</p>
            )}
          </div>
        </div>

        <div className=" justify-end mt-6 space-x-4 hidden md:flex">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
          >
            {isSubmitting ? "Đang xử lý..." : "Tạo quyền"}
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
