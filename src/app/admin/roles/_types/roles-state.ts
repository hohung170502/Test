import { z } from "zod";
export type FormState =
  | {
     id?: number | string;
      name?: string;
      description?: string;
      error?: {
        name?: string[];
        description?: string[];
      };
      success?: boolean;
      message?: string;
    }
  | undefined;

export const roles_form_schema = z.object({
  name: z.string().min(1, "Tên vai trò không được để trống"),
  description: z.string().optional(),
});
