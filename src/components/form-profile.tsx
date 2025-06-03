"use client";
import React, { useEffect, useState } from "react";

import { toast } from "sonner";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  getProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
} from "@/app/admin/profile/_services/profile";
import { useUserStore } from "@/stores/userStore";
interface ProfileData {
  email: string;
  avatar: string;
  username: string;
  phonenumber: string;
  address: string;
  gender: string;
  birthday: string;
}
interface ActionState {
  success?: boolean;
  error?: {
    email?: string[];
    avatar?: string[];
    roles?: string[];
    username?: string[];
    phonenumber?: string[];
    address?: string[];
    gender?: string[];
    birthday?: string[];
    oldPassword?: string[];
    newPassword?: string[];
    confirmPassword?: string[];
  };
}
export function FormDemo() {
  const setUser = useUserStore((state) => state.setUser);
  const [gender, setGender] = useState<string>("");
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [state, setState] = useState<ActionState>({});
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordState, setPasswordState] = useState<ActionState>({});
  // State theo dõi thay đổi form
  const [profileChanged, setProfileChanged] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  // Lấy profile lúc mount component
  useEffect(() => {
    async function fetchProfile() {
      const result = await getProfile();
      if (result?.success) {
        setProfileData(result.data);
        setUser(result.data); // cập nhật store
        setGender(result.data.gender );
      } else {
        toast.error("Không thể tải thông tin người dùng.");
        console.error("❌ Lỗi tải thông tin người dùng:", result?.message);
      }
    }
    fetchProfile();
  }, [setUser]);
  // Hiển thị toast khi có success hoặc error (profile)
  useEffect(() => {
    if (state.success) {
      toast.success("Cập nhật thông tin thành công!");
    } else if (state.error) {
      toast.error(
        "Cập nhật thông tin thất bại. Vui lòng kiểm tra lại thông tin."
      );
      console.error("❌ Lỗi cập nhật thông tin:", state.error);
    }
  }, [state]);
  // Hiển thị toast khi có success hoặc error (password)
  useEffect(() => {
    if (passwordState.success) {
      toast.success("Đổi mật khẩu thành công!");
      setShowPasswordForm(false);
    } else if (passwordState.error) {
      toast.error("Đổi mật khẩu thất bại. Vui lòng kiểm tra lại.");
      console.error("❌ Lỗi đổi mật khẩu:", passwordState.error);
    }
  }, [passwordState]);
  // Theo dõi thay đổi form profile để bật state
  const handleProfileChange = () => {
    if (!profileChanged) setProfileChanged(true);
  };
  // Theo dõi thay đổi form mật khẩu để bật state
  const handlePasswordChange = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const newPassword = form.newPassword?.value.trim();
    const confirmPassword = form.confirmPassword?.value.trim();

    if (newPassword !== "" || confirmPassword !== "") {
      if (!passwordChanged) setPasswordChanged(true);
    } else {
      setPasswordChanged(false);
    }
  };
  // Hàm xử lý nút lưu chung (cập nhật profile + đổi mật khẩu)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!profileChanged && !passwordChanged) {
      toast.info("Bạn chưa thay đổi gì cả!");
      return;
    }

    // Cập nhật profile nếu có thay đổi
    const formData = new FormData(e.currentTarget);
    formData.set("gender", gender);

    const result = await updateProfile(formData);

    if (result?.success) {
      if (result.data) {
        setProfileData(result.data);
        setUser(result.data);
        setGender(result.data.gender || "");
      } else {
        const freshProfile = await getProfile();
        if (freshProfile?.success) {
          setProfileData(freshProfile.data);
          setUser(freshProfile.data);
          setGender(freshProfile.data.gender || "");
        }
      }
      setState({ success: true, error: undefined });
      setProfileChanged(false);
    } else {
      setState({ success: false, error: result?.error });
    }

    // Đổi mật khẩu nếu có thay đổi
    if (passwordChanged) {
      const passwordForm = document.getElementById(
        "change-password-form"
      ) as HTMLFormElement;
      const passwordFormData = new FormData(passwordForm);

      const resultPassword = await changePassword(undefined, passwordFormData);

      if (!resultPassword?.success) {
        console.error("❌ Lỗi đổi mật khẩu:", resultPassword); // Log cả object thay vì error rỗng
        setPasswordState({
          success: false,
          error: resultPassword?.error ?? {
            oldPassword: ["Đã xảy ra lỗi không xác định."],
          },
        });
        toast.error("Đổi mật khẩu thất bại");
        return;
      } else {
        setPasswordState({ success: true, error: undefined });
        passwordForm.reset();
        setShowPasswordForm(false);
        setPasswordChanged(false);
      }
    }
  };
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Dung lượng file không được vượt quá 5MB.");
      return;
    }
    const result = await uploadAvatar(file);
    if (result?.success) {
      const freshProfile = await getProfile();
      if (freshProfile?.success) {
        setProfileData(freshProfile.data);
        setUser(freshProfile.data);
        setGender(freshProfile.data.gender || "");
      }
      toast.success("Cập nhật ảnh đại diện thành công!");
    } else {
      toast.error(result?.message || "Cập nhật ảnh đại diện thất bại");
    }
  };
  return (
    <div className="relative flex-1 min-w-0 max-w-full">
      <div className="px-2">
        {/* Ảnh đại diện */}
        <div className="mt-4">
          <Label className="block mb-2 text-base font-medium">
            Ảnh đại diện
          </Label>
          <div className="flex items-start gap-6 mb-6">
            <Avatar className="h-16 w-16 rounded-lg border">
              <AvatarImage
                src={profileData?.avatar || "/images/customer-empty.png"}
                alt="avatar"
                className="object-cover"
              />
              <AvatarFallback className="rounded-lg" />
            </Avatar>
            <div>
              <label htmlFor="avatar">
                <Button
                  type="button"
                  variant="outline"
                  className="mb-2 cursor-pointer"
                  asChild
                >
                  <span>Cập nhật ảnh mới</span>
                </Button>
              </label>
              <Input
                id="avatar"
                name="avatar"
                type="file"
                accept="image/png, image/jpeg"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <div className="text-xs text-muted-foreground mt-1">
                Dung lượng file tối đa 5 MB.
                <br />
                Định dạng: <b>.JPEG, .PNG</b>
              </div>
            </div>
          </div>
        </div>
        {/* Form thông tin cá nhân */}
        <form
          id="profile-form"
          onSubmit={handleSubmit}
          onChange={handleProfileChange}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Họ và tên
              </Label>
              <Input
                id="username"
                name="username"
                placeholder="Nhập họ và tên"
                defaultValue={profileData?.username || ""}
                className="hover:border-blue-500 focus:border-blue-500"
                required
              />
              {state?.error?.username && (
                <p className="text-sm text-red-500">{state.error.username}</p>
              )}
            </div>
          </div>
          <div>
            <div className="space-y-2">
              <Label
                htmlFor="phonenumber"
                className="block text-sm font-medium text-gray-700"
              >
                Số điện thoại
              </Label>
              <Input
                id="phonenumber"
                name="phonenumber"
                placeholder="Nhập số điện thoại"
                defaultValue={profileData?.phonenumber || ""}
                className="hover:border-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          <div>
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </Label>
              <Input
                id="email"
                name="email"
                placeholder="Nhập email"
                defaultValue={profileData?.email || ""}
                disabled
              />
            </div>
          </div>
          <div>
            <div className="space-y-2">
              <Label
                htmlFor="birthday"
                className="block text-sm font-medium text-gray-700"
              >
                Ngày sinh
              </Label>

              <div className="relative">
                <Input
                  id="birthday"
                  name="birthday"
                  type="date"
                  defaultValue={profileData?.birthday || ""}
                  className="hover:border-blue-500 focus:border-blue-500 pr-10" // thêm padding phải để không che icon
                  placeholder="Chọn ngày sinh"
                />

                {/* Icon nằm bên phải */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  {/* Ví dụ dùng icon calendar từ Heroicons */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10m-9 4h9m-9 4h9M3 8h18v12a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="space-y-2">
              <Label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700"
              >
                Giới tính
              </Label>
              <Select
                value={gender}
                onValueChange={(value) => {
                  setGender(value);
                  handleProfileChange();
                }}
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">male</SelectItem>
                  <SelectItem value="female">female</SelectItem>
                  <SelectItem value="other">other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <div className="space-y-2">
              <Label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Địa chỉ
              </Label>
              <Input
                id="address"
                name="address"
                placeholder="Nhập địa chỉ"
                defaultValue={profileData?.address || ""}
                className="hover:border-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </form>
        {/* Thay đổi mật khẩu */}
        <div className="flex items-center justify-between mt-6">
          <button
            type="button"
            className="text-blue-600 text-sm focus:outline-none"
            onClick={() => setShowPasswordForm((v) => !v)}
          >
            Thay đổi mật khẩu
          </button>
        </div>
        {/* Form đổi mật khẩu */}
        <form
          id="change-password-form"
          onSubmit={(e) => e.preventDefault()}
          onChange={handlePasswordChange}
          className={`overflow-hidden transition-all duration-500 ${
            showPasswordForm ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="grid gap-2 mt-4">
            <div className="flex items-center mb-2">
              <Label htmlFor="oldPassword">Mật khẩu cũ</Label>
            </div>
            <Input
              id="oldPassword"
              name="oldPassword"
              type="password"
              placeholder="Nhập mật khẩu cũ"
              className="hover:border-blue-500 focus:border-blue-500 focus:ring-blue-500"
              required={passwordChanged}
            />
            {passwordState.error?.oldPassword && (
              <p className="text-sm text-red-500">
                {passwordState.error.oldPassword.join(", ")}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <div className="flex items-center mb-2">
                <Label htmlFor="newPassword">Mật khẩu mới</Label>
              </div>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder="Nhập mật khẩu mới"
                className="hover:border-blue-500 focus:border-blue-500 focus:ring-blue-500"
                required={passwordChanged}
              />
              {passwordState.error?.newPassword && (
                <p className="text-sm text-red-500">
                  {passwordState.error.newPassword.join(", ")}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center mb-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
              </div>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Xác nhận mật khẩu mới"
                className="hover:border-blue-500 focus:border-blue-500 focus:ring-blue-500"
                required={passwordChanged}
              />
              {passwordState.error?.confirmPassword && (
                <p className="text-sm text-red-500">
                  {passwordState.error.confirmPassword.join(", ")}
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
      {/* Nút lưu thay đổi duy nhất */}
      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          form="profile-form"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
        >
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
}
