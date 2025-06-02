"use client";

import { FormDemo } from "@/components/form-profile";

export default function ProfilePage() {
  return (
    <div className="bg-[#f5f5f5] flex  p-4">
      <div className="bg-white p-4 rounded-md shadow border w-full ">
        <div className="py-4 border-b">
          <h2 className="text-2xl font-bold">Thông tin cá nhân</h2>
          <p className="text-sm text-gray-500">
            Cập nhật thông tin cá nhân của bạn
          </p>
        </div>
        <FormDemo />
      </div>
      {/* <div className="theme-scaled">
        <FormDemo />
      </div> */}
    </div>
  );
}
