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
       
      };
      success?: boolean;
      message?: string;
      data?: any; // Thêm dòng này để chứa dữ liệu profile trả về
    }
  | undefined;

export const profile_form_schema = z.object({
  
});
