import { z } from "zod";
export type FormState =
  | {
      email?: string;
      avatar?: string;
      username?: string;
      phonenumber?: string;
      address?: string;
      gender?: string;
      birthday?: string;

      oldPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
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
           confirmPassword?: string[]

      };
      success?: boolean;
      message?: string;
      data?: any; // Thêm dòng này để chứa dữ liệu profile trả về
    }
  | undefined;

export const profile_form_schema = z.object({
  username: z.string().min(1, "Tên người dùng không được để trống"),
  phonenumber: z
    .string()
    .min(10, {
      message: "Số điện thoại phải có ít nhất 10 ký tự.",
    })
    .max(15, {
      message: "Số điện thoại không được dài hơn 15 ký tự.",
    }),
  address: z.string().min(1, "Địa chỉ không được để trống"),
  gender: z.enum(["male", "female", "other"]).refine((val) => !!val, {
    message: "Giới tính không hợp lệ",
  }),
  birthday: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày sinh không hợp lệ"),
});
export const change_password_form_schema = z.object({
  oldPassword: z.string().min(1, "Mật khẩu cũ không được để trống"),
  newPassword: z
    .string()
    .min(8, "Mật khẩu mới phải có ít nhất 8 ký tự")
    .max(100)
    .refine((val) => val !== "", {
      message: "Mật khẩu mới không được để trống",
    }),
  confirmPassword: z.string().min(1, "Xác nhận mật khẩu không được để trống"),
});
