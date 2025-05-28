"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

//   useEffect(() => {
//     const fetchPolicies = async () => {
//       try {
//         setLoading(true);
//         const result = await getPolicies({ pageIndex, pageSize, isDeep: true });

//         if (result.success && Array.isArray(result.data)) {
//           setPolicies(result.data);
//           const totalRecords = result.totalRecords || 0;
//           setTotalPages(Math.ceil(totalRecords / pageSize));
//           toast.success("Tải danh sách quyền thành công!");
//         } else {
//           toast.error(
//             "Lỗi khi tải quyền: " + (result.message || "Dữ liệu không hợp lệ")
//           );
//           setPolicies([]);
//         }
//       } catch (error) {
//         console.error("❌ Lỗi khi gọi getPolicies:", error);
//         toast.error("❌ Lỗi không mong đợi khi tải dữ liệu.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPolicies();
//   }, [pageIndex, pageSize]);
//   const handleDeletePolicies = async (id: string) => {
//     try {
//       const response = await deletePolicy(id);
//       if (response?.success) {
//         setPolicies((prev) => prev.filter((p) => p.id !== id));
//         toast.success("Đã xóa quyền thành công!");
//       } else {
//         toast.error(" Xóa thất bại: " + response?.message);
//       }
//     } catch (error) {
//       console.error("❌ Lỗi khi xóa quyền:", error);
//       toast.error("❌ Có lỗi xảy ra khi xóa.");
//     }
//   };
  return (
    <div className="p- bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center py-4 border-b">
        <h1 className="text-lg font-semibold">Nhóm admin</h1>

        <div className="flex items-center gap-4">
          <Link href="/admin/policies/create">
            <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700">
              <span className="p-icon inline-flex justify-center items-center w-6 h-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  focusable="false"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    fill="currentColor"
                    d="M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10m-1 5v4h-4v2h4v4h2v-4h4v-2h-4v-4zm-7 5c0 4.41 3.59 8 8 8s8-3.59 8-8-3.59-8-8-8-8 3.59-8 8"
                  />
                </svg>
              </span>
              Thêm nhóm
            </button>
          </Link>
        </div>
      </div>

      {/* Danh sach phân quyền */}
      <div className="mt-4">
        <div className="relative border bg-white rounded-sm shadow-sm">
          {/* Tabs */}
          <div className="p-4">
            <div className="flex border-b">
              <button className="text-blue-600 font-semibold px-4 pb-2 border-b-2 border-blue-600">
                Tất cả
              </button>
            </div>

            {/* Bộ lọc */}
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <div className="relative flex-grow">
                <SearchIcon className="absolute left-3 top-2 text-gray-500 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm theo tên nhóm"
                  className="w-full h-10 pl-10 border-gray-300 rounded-md hover:border-gray-400 focus:border-gray-400 focus:ring-blue-500 focus:ring-1 focus:ring-offset-1 focus:ring-offset-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Danh sách bảng */}
          <div className="mt-2 bg-white w-full overflow-x-auto">
            <table className="w-full border-collapse min-w-[400px]">
              <thead className="bg-gray-100 border-b">
                <tr className="text-gray-600 text-left text-sm">
                  <th className="px-3 py-3 text-center w-10">
                    <input type="checkbox" className="w-4 h-4" />
                  </th>
                  <th className="px-3 py-3 text-left min-w-[200px]">
                    Tên nhóm
                  </th>
                  <th className="px-3 py-3 text-center min-w-[100px]">
                    Quyền quản lý
                  </th>
                  <th className="px-3 py-3 text-left min-w-[150px]">Mô tả</th>

                  <th className="px-3 py-3 text-center min-w-[150px]">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {policies.map((policy) => (
                  <tr key={policy.id} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-3">
                      <input type="checkbox" className="w-4 h-4" />
                    </td>
                    <td className="px-3 py-3 text-blue-600 hover:underline cursor-pointer">
                      <Link href={`/admin/policies/edit/${policy.id}`}>
                        {policy.name}
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-center">
                      {policy.permissions && policy.permissions.length > 0 ? (
                        <div className="flex flex-wrap justify-center gap-1">
                          {policy.permissions.map((perm: any) => (
                            <span
                              key={perm.id}
                              className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded"
                            >
                              {perm.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Không có</span>
                      )}
                    </td>
                    <td className="px-3 py-3">{policy.description}</td>
                    <td className="px-3 py-3 text-center">
                      <button
                        // onClick={() => handleDeletePolicies(policy.id)}
                        className="text-red-600 hover:underline text-center font-semibold"
                      >
                        <DeletePermission className="inline-block w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-3 border-t">
            <div />
            <div className="flex items-center">
              <button
                onClick={() => setPageIndex((prev) => Math.max(prev - 1, 1))}
                className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-l-md text-gray-400 bg-white hover:bg-gray-50 disabled:opacity-50"
                disabled={pageIndex === 1}
              >
                &lt;
              </button>
              <span className="w-9 h-9 flex items-center justify-center border border-gray-300 font-medium">
                {pageIndex}
              </span>
              <button
                onClick={() =>
                  setPageIndex((prev) => (prev < totalPages ? prev + 1 : prev))
                }
                className="w-9 h-9 flex items-center justify-center border border-gray-300 bg-white rounded-r-md text-gray-400 hover:bg-gray-50 disabled:opacity-50"
                disabled={pageIndex >= totalPages}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>

        {/* Pagination */}
      </div>
    </div>
  );
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function Filter(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle cx="11" cy="11" r="8" />
      <path
        fill="currentColor"
        d="M14 21.75a.75.75 0 0 1-.45-.15l-4-3a.75.75 0 0 1-.3-.6v-4a.75.75 0 0 0-.22-.531l-5.121-5.121a2.24 2.24 0 0 1-.659-1.591v-2.257a2.253 2.253 0 0 1 2.25-2.25h13a2.253 2.253 0 0 1 2.25 2.25v2.257a2.24 2.24 0 0 1-.659 1.591l-5.121 5.121a.75.75 0 0 0-.22.531v7a.75.75 0 0 1-.75.75m-3.25-4.125 2.5 1.875v-5.5a2.24 2.24 0 0 1 .659-1.591l5.121-5.121a.75.75 0 0 0 .22-.531v-2.257a.75.75 0 0 0-.75-.75h-13a.75.75 0 0 0-.75.75v2.257a.75.75 0 0 0 .22.531l5.121 5.121a2.23 2.23 0 0 1 .659 1.591z"
      ></path>
    </svg>
  );
}

function FilterButton({ label }: { label: string }) {
  return (
    <button className="border px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all flex items-center gap-2">
      {label}
      <ChevronDown className="w-5 h-5 text-gray-500" />
    </button>
  );
}

function DeletePermission(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  );
}
