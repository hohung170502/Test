"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
// import EmployeeForm from "./components/Employee/EmployeeForm";
import { getSession } from "@/app/(auth)/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function UsersListPage() {
  const [ownerInfo, setOwnerInfo] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState("all");
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const session = await getSession();
  //     if (!session || !session.user) return;

  //     const userId = session.user.id;
  //     const ownerRes = await getUsersById(userId);
  //     const usersRes = await getUsers({});

  //     if (ownerRes.success) {
  //       setOwnerInfo(ownerRes.data);
  //     }

  //     if (usersRes.success) {
  //       const staffAccounts = usersRes.data.filter(
  //         (user: any) => String(user.userId) !== String(ownerRes.data?.userId)
  //       );
  //       setEmployees(staffAccounts);
  //       setFilteredEmployees(staffAccounts); // Initialize with all employees
  //     } else {
  //       console.error(usersRes.message);
  //     }
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
    const filterEmployees = () => {
      if (filterStatus === "all") {
        setFilteredEmployees(employees);
      } else if (filterStatus === "online") {
        setFilteredEmployees(employees.filter((emp) => emp.isOnline));
      } else if (filterStatus === "offline") {
        setFilteredEmployees(employees.filter((emp) => !emp.isOnline));
      }
    };

    filterEmployees();
  }, [filterStatus, employees]);
  // Kiểm tra xem người dùng có hoạt động trong 5 phút qua hay không
  // Số lượng tài khoản
  const activeAccounts = 1;
  const maxAccounts = 3;
  const progress = (activeAccounts / maxAccounts) * 100;
  // Lấy thông tin người dùng từ session
  return (
    <div className="relative flex-1 min-w-0 max-w-full pb-10">
      <div className="px-2">
        <div>
          <div className="py-2">
            <div className="">
              <div className="flex-nowrap">
                <div className="py-1.5 px-0.5">
                  <h1
                    className="text-xl"
                    style={{
                      lineHeight: "calc(1.75rem * var(--ui-rem-scale))",
                    }}
                  >
                    Danh sách admin
                  </h1>
                </div>
                <div className="flex justify-end flex-1 items-center self-start ml-4 whitespace-nowrap"></div>
              </div>
            </div>
          </div>
          {/* Tổng quan tài khoản */}
          <div className="pb-5">
            <div className="w-full mx-auto bg-white shadow-sm rounded-xl p-4 border">
              {/* Tiêu đề */}
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Tổng quan tài khoản
              </h2>

              {/* Thanh tiến trình */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {/* Thông tin chi tiết */}
              <div className="flex flex-col space-y-1 text-gray-700 text-sm">
                <div className="flex justify-between">
                  <span>Tài khoản đang kích hoạt</span>
                  <span className="font-semibold">{activeAccounts}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tài khoản được kích hoạt tối đa</span>
                  <span className="font-semibold">{maxAccounts}</span>
                </div>
              </div>
            </div>
          </div>
          {/* Tài khoản chủ cửa hàng */}
          <div className="pb-5">
            <div className="w-full mx-auto bg-white shadow-sm rounded-xl p-4 border">
              <h2 className="text-md font-semibold text-gray-900 mb-3">
                Tài khoản chủ cửa hàng
              </h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <p className="text-sm sm:text-base font-semibold text-blue-600 break-words">
                      {ownerInfo?.userName}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center text-sm sm:text-base text-gray-500">
                      <span className="whitespace-nowrap">
                        Đăng nhập lần cuối:
                      </span>
                      <span className="sm:ml-1 mt-1 sm:mt-0 break-words">
                        {ownerInfo?.lastLogin
                          ? new Date(ownerInfo.lastLogin).toLocaleString(
                              "vi-VN",
                              {
                                timeZone: "Asia/Ho_Chi_Minh",
                              }
                            )
                          : ""}
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm flex items-center space-x-2 ${
                    ownerInfo?.isOnline
                      ? "border border-green-400 text-green-500"
                      : "border border-red-400 text-red-500"
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      ownerInfo?.isOnline ? "bg-green-400" : "bg-red-400"
                    }`}
                  ></div>
                  <span>
                    {ownerInfo?.isOnline ? "Đang hoạt động" : "Không hoạt động"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tài khoản nhân viên */}
          <div>
            <div className="relative border flex-1 min-w-0 max-w-full bg-white shadow-sm rounded-md">
              <div className="flex items-center justify-between px-4 mt-4">
                <h2 className="text-base font-semibold">Tài khoản nhân viên</h2>
                <select
                  className="border rounded-md p-1 text-sm"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Tất cả</option>
                  <option value="online">Đang hoạt động</option>
                  <option value="offline">Không hoạt động</option>
                </select>
              </div>

              {filteredEmployees.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Image
                    src="/images/empty-user.png"
                    alt="logo"
                    width={100}
                    height={100}
                    className="w-25 h-25"
                  />
                  <h2 className="text-lg font-medium mt-4 text-gray-500">
                    Không có nhân viên nào
                  </h2>
                  <div className="mt-4 flex justify-center items-center space-x-4">
                    <Link href="/admin/account/create">
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center">
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
                        Thêm mới nhân viên
                      </button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {filteredEmployees.map((emp, index) => (
                    <div
                      key={emp.id || emp.userName || index}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                          <p className="text-sm sm:text-base font-semibold text-blue-600 break-words">
                            {emp?.userName}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:items-center text-sm sm:text-base text-gray-500">
                            <span className="whitespace-nowrap">
                              Đăng nhập lần cuối:
                            </span>
                            <span className="sm:ml-1 mt-1 sm:mt-0 break-words">
                              {emp?.lastLogin
                                ? new Date(emp.lastLogin).toLocaleString(
                                    "vi-VN",
                                    {
                                      timeZone: "Asia/Ho_Chi_Minh",
                                    }
                                  )
                                : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-sm flex items-center space-x-2 ${
                          emp.isOnline
                            ? "border border-green-400 text-green-500"
                            : "border border-red-400 text-red-500"
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            emp.isOnline ? "bg-green-400" : "bg-red-400"
                          }`}
                        ></div>
                        <span>
                          {emp.isOnline ? "Đang hoạt động" : "Không hoạt động"}
                        </span>
                      </div>
                    </div>
                  ))}

                  <div className="mt-4 flex justify-center items-center space-x-4">
                    <Link href="/admin/account/create">
                      <button
                        type="button"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                      >
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
                        <span className="ml-2">Thêm mới nhân viên</span>
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
