import { z } from "zod";

export type FormState =
  | {
      id?: number | string;
      name?: string;
      description?: string;
      permissions?: string[];

      success?: boolean;
      error?: {
        name?: string[];
        description?: string[];
        permissions?: string[];
      };

      message?: string;
    }
  | undefined;

export const policies_form_schema = z.object({
  name: z
    .string()
    .min(1, { message: "Tên chính sách không được để trống" })
    .max(100, { message: "Tên chính sách tối đa 100 ký tự" }),
  description: z
    .string()
    .max(500, { message: "Mô tả tối đa 500 ký tự" })
    .optional(),
  
  permissions: z
    .array(z.string(), {
      required_error: "Danh sách quyền không được để trống",
    })
    .min(1, { message: "Phải chọn ít nhất 1 quyền" }),
});
