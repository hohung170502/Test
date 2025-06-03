"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronDown,
  FileText,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getUsers } from "./_services/account";
import { toast } from "sonner";

export default function UserListPage() {
  const [listUser, setListUser] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sortOrder, setSortOrder] = useState(true);
  const [sortField, setSortField] = useState("");
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await getUsers({
          limit: pageSize,
          page: pageIndex,
          sort: sortOrder,
          sortField,
        });

        if (response.success) {
          setListUser(response.data || []);
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

    fetchUsers();
  }, [pageIndex, pageSize, sortOrder, sortField]);

  return (
    <div className="flex-1 min-w-0 bg-gray-50/50 relative inset-0 px-2 pb-10  sm:p-  ">
      {/* Header */}
      <div className="mb-6 p-4">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="py-1.5">
            <h1 className="text-2xl font-semibold text-gray-800">
              Quản lý nhân viên
            </h1>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center hover:bg-gray-50 transition-colors">
              <FileText className="w-4 h-4 mr-2 text-gray-600" />
              <span className="text-gray-700 font-medium">Xuất file</span>
            </button>
            <button className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center hover:bg-gray-50 transition-colors">
              <span className="text-gray-700 font-medium">Thao tác khác</span>
              <ChevronDown className="w-4 h-4 ml-2 text-gray-500" />
            </button>
            <Link href="/admin/account/create">
              <button className="px-4 py-2.5 bg-blue-600 text-white rounded-lg shadow-sm flex items-center hover:bg-blue-700 transition-colors">
                <Plus className="w-5 h-5 mr-1.5" />
                <span className="font-medium">Tạo nhân viên</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 max-w-[450px] md:max-w-[1200px] mx-auto mt-4">
        <div className="p-2">
          <div className="flex border-b">
            <button className="text-blue-600 font-semibold px-4 pb-2 border-b-2 border-blue-600">
              Tất cả
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-row gap-3 mt-4 w-full">
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Tìm kiếm theo tên thương hiệu..."
                className="w-full h-10 pl-10 border-gray-300 rounded-md"
              />
            </div>

            <select className="h-10 px-3 border border-gray-300 rounded-md text-sm w-full sm:w-auto">
              <option value="">Sắp xếp theo ưu tiên</option>
              <option value="asc">Từ thấp đến cao</option>
              <option value="desc">Từ cao đến thấp</option>
            </select>

            <button className="bg-gray-200 text-gray-500 px-4 py-2 rounded-md w-full sm:w-auto cursor-not-allowed">
              Lưu bộ lọc
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="relative overflow-x-auto">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
            </div>
          )}
          <style jsx>{`
            table {
              border-collapse: separate;
              border-spacing: 0;
            }

            .scroll-container {
              overflow: auto;
              position: relative;
              width: 100%;
            }

            .sticky-col {
              position: sticky;
              top: 0;
              background-color: #ffffff;
              border-bottom: 1px solid #e5e7eb;
              border-top: 1px solid #e5e7eb;
              z-index: 10;
              box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
              transition: background-color 0.3s ease;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              padding: 0.75rem 1rem;
              text-align: center;
            }

            .sticky-col-1 {
              left: 0;
              z-index: 30;
            }

            .sticky-col-2 {
              left: 48px; /* Điều chỉnh theo đúng width thực tế của cột đầu tiên */
              z-index: 25;
            }

            .sticky-col-3 {
              position: sticky;
              left: 148px; /* Điều chỉnh theo width thực tế của 2 cột đầu tiên cộng lại */
              z-index: 20;
            }

            tr:hover .sticky-col {
              background-color: #ffffff;
            }
          `}</style>

          <div className="scroll-container">
            <table className="w-full min-w-max border-collapse">
              <thead className="bg-gray-100 border-b font-semibold">
                <tr>
                  <th className="px-3 py-3 sticky-col text-center sticky-col-1">
                    <input type="checkbox" className="w-4 h-4" />
                  </th>
                  <th className="px-3 py-3 sticky-col sticky-col-2">
                    Hình ảnh
                  </th>
                  <th className="px-3 py-3 sticky-col sticky-col-3">
                    Họ và tên
                  </th>
                  <th className="px-3 py-3 sticky-col">Email</th>
                  <th className="px-3 py-3 sticky-col">Địa chỉ</th>
                  <th className="px-3 py-3 sticky-col">Ngày sinh</th>
                  <th className="px-3 py-3 sticky-col">Giới tính</th>
                  <th className="px-3 py-3 sticky-col">Số điện thoại</th>
                  <th className="px-3 py-3 sticky-col">Chức vụ</th>
                  <th className="px-3 py-3 sticky-col">Ngày tạo tài khoản</th>
                  <th className="px-3 py-3 sticky-col text-center">
                    Tính năng
                  </th>
                </tr>
              </thead>
              <tbody>
                {listUser.map((user, index) => (
                  <tr
                    key={user._id || index}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-3 py-3 sticky-col text-center sticky-col-1">
                      <input type="checkbox" className="w-4 h-4" />
                    </td>
                    <td className="px-3 py-3 sticky-col sticky-col-2">
                      <img
                        src={user.avatar}
                        alt="Avatar"
                        className="w-12 h-12 object-contain rounded-full"
                      />
                    </td>
                    <td className="px-3 py-3 sticky-col font-medium text-blue-600 hover:underline sticky-col-3">
                      <Link href={`/admin/brand/edit/${user.id}`}>
                        {user.username}
                      </Link>
                    </td>
                    <td className="px-3 py-3 sticky-col">{user.email}</td>
                    <td className="px-3 py-3 sticky-col">{user.address}</td>
                    <td className="px-3 py-3 sticky-col">
                      {user.birthday
                        ? (() => {
                            const date = new Date(user.birthday);
                            const day = String(date.getDate()).padStart(2, "0");
                            const month = String(date.getMonth() + 1).padStart(
                              2,
                              "0"
                            );
                            const year = date.getFullYear();
                            return `${day}-${month}-${year}`;
                          })()
                        : ""}
                    </td>
                    <td className="px-3 py-3 sticky-col">{user.gender}</td>
                    <td className="px-3 py-3 sticky-col">{user.phonenumber}</td>
                    <td className="px-3 py-3 sticky-col">
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(user.roles) ? (
                          user.roles.map((role: string, i: number) => (
                            <span
                              key={i}
                              className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                            >
                              {role}
                            </span>
                          ))
                        ) : (
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {user.roles ? user.roles : "Chưa có vai trò"}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 sticky-col">{user.createdAt}</td>
                    <td className="px-3 py-3 sticky-col text-center">
                      <button className="text-red-600 hover:underline">
                        <DeleteBrand className="inline-block w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 flex justify-between items-center border-t">
            <div className="text-sm text-gray-600">
              Từ {pageIndex * pageSize - pageSize + 1} đến{" "}
              {Math.min(pageIndex * pageSize, listUser.length)} trên tổng{" "}
              {listUser.length}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Hiển thị</span>
              <button
                className="px-3 py-1.5 bg-white border border-gray-300 rounded-md flex items-center shadow-sm"
                onClick={() => setPageIndex((p) => Math.max(1, p - 1))}
                disabled={pageIndex === 1}
              >
                <span className="font-medium">10</span>
                <ChevronDown className="w-4 h-4 ml-2 text-gray-500" />
              </button>
              <span className="text-sm text-gray-600">Kết quả</span>
            </div>
            <div className="flex gap-1">
              <button className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-l-md bg-white text-gray-400 hover:bg-gray-50 transition-colors">
                &lt;
              </button>
              <button className="w-9 h-9 flex items-center justify-center border border-gray-300 bg-blue-600 text-white font-medium">
                {pageIndex}
              </button>
              <button
                className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-r-md bg-white text-gray-400 hover:bg-gray-50 transition-colors"
                onClick={() => setPageIndex((p) => p + 1)}
                disabled={pageIndex >= totalPages}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DowloadFile(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      focusable="false"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M22 11.273v6.545a2.646 2.646 0 0 1-2.727 2.546h-14.546a2.646 2.646 0 0 1-2.727-2.546v-6.545a.91.91 0 0 1 1.818 0v6.545a.845.845 0 0 0 .91.727h14.545a.846.846 0 0 0 .909-.727v-6.545a.909.909 0 0 1 1.818 0m-12.19-2.882 1.28-1.291v7.81a.909.909 0 0 0 1.82 0v-7.81l1.28 1.29a.91.91 0 0 0 1.556-.645.91.91 0 0 0-.264-.645l-2.836-2.836a.9.9 0 0 0-.582-.264h-.173a.9.9 0 0 0-.491.218h-.046l-2.836 2.882a.913.913 0 0 0 1.291 1.29"
      ></path>
    </svg>
  );
}

function ImportFile(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      focusable="false"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M22 11.275v6.546a2.646 2.646 0 0 1-2.727 2.544h-14.546a2.646 2.646 0 0 1-2.727-2.544v-6.546a.909.909 0 0 1 1.815 0v6.546c.06.447.46.767.908.728h14.545a.843.843 0 0 0 .908-.728v-6.546c0-.503.41-.908.908-.908a.905.905 0 0 1 .916.908m-12.188.153a.91.91 0 0 0-1.292 0 .91.91 0 0 0 0 1.291l2.839 2.881h.046c.137.12.312.196.49.218h.175a.9.9 0 0 0 .584-.265l2.838-2.838a.913.913 0 0 0 0-1.287l-.004-.004a.913.913 0 0 0-1.287.004l-1.291 1.291v-7.811a.91.91 0 0 0-.908-.908.91.91 0 0 0-.908.908v7.811z"
      ></path>
    </svg>
  );
}

function AddBrand(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
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
  );
}

function DeleteBrand(props: React.SVGProps<SVGSVGElement>) {
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
