import { z } from "zod";
export type FormState =
  | {
      error?: {
        email?: string[];
        password?: string[];
      };
      success?: boolean;
      message?: string;
      data?: any; // Thêm dòng này để chứa dữ liệu profile trả về

    }
  | undefined;

  export const profile_form_schema = z.object({ });