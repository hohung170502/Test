"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { getPermissions, PermissionDelete } from "./_services/permission";

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sortOrder, setSortOrder] = useState(true);
  const [sortField, setSortField] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedPermissionId, setSelectedPermissionId] = useState<
    string | null
  >(null);

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

  const handleDeletePermission = async (id: string) => {
    try {
      const response = await PermissionDelete(id);
      if (response.success) {
        setPermissions((prev) => prev.filter((p) => p._id !== id));
        toast.success("Đã xóa quyền thành công!");
      } else {
        toast.error(" Xóa thất bại: " + response.message);
      }
    } catch (error) {
      console.error("❌ Lỗi khi xóa quyền:", error);
      toast.error("❌ Có lỗi xảy ra khi xóa.");
    }
  };

  const handleDeleteClick = (id: string) => {
    setSelectedPermissionId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (selectedPermissionId) {
      await handleDeletePermission(selectedPermissionId);
      setShowModal(false);
      setSelectedPermissionId(null);
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
    setSelectedPermissionId(null);
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Danh sách quyền</h1>
        <Link href="/admin/permission/create">
          <button
            type="submit"
            className=" bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
          >
            <span className="p-icon w-6 h-6">
              <AddBrand />
            </span>
            Thêm quyền
          </button>
        </Link>
      </div>

      <div className="mt-4 bg-white border shadow-sm rounded-sm">
        <div className="p-2">
          <div className="flex border-b">
            <button className="text-blue-600 font-semibold px-4 pb-2 border-b-2 border-blue-600">
              Tất cả
            </button>
          </div>
          <div className="flex flex-col md:flex-row flex-wrap items-stretch md:items-center gap-3 mt-4">
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Tìm kiếm theo tên quyền"
                className="w-full h-10 pl-10 border-gray-300 rounded-md"
              />
            </div>

            <button className="bg-gray-200 text-gray-500 px-4 py-2 rounded-md cursor-not-allowed">
              Lưu bộ lọc
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto border text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-center w-10">
                  <input type="checkbox" className="w-4 h-4" />
                </th>
                <th className="p-3 text-center">Tên quyền</th>
                <th className="p-3 text-center">Mô tả</th>
                <th className="p-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((permission, index) => (
                <tr
                  key={permission._id || index}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="text-center p-3 ">
                    <input type="checkbox" className="w-4 h-4" />
                  </td>
                  <td className="p-3 text-blue-600 font-medium hover:underline text-center">
                    <Link href={`/admin/permission/edit/${permission._id}`}>
                      {permission.name}
                    </Link>
                  </td>
                  <td className="p-3 text-center">{permission.description}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleDeleteClick(permission._id!)}
                      className="text-red-600 hover:underline font-semibold"
                    >
                      <DeletePermission className="inline-block w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {permissions.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className="text-center p-4 text-gray-500">
                    Không có quyền nào được tìm thấy.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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

      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          style={{ top: 0, left: 0, width: "100vw", height: "100vh" }}
        >
          <div className="bg-white p-6 rounded shadow-md text-center z-60">
            <p className="text-lg font-semibold mb-4">
              Bạn có chắc thực hiện thao tác xóa không?
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Bạn sẽ không thể lấy lại được dữ liệu này!
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Không
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Có
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
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
