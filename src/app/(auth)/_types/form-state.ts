import { z } from "zod";
export type FormState =
  | {
      error?: {
        email?: string[];
        password?: string[];
        username?: string[];
        phonenumber?: string[];
        address?: string[];
        gender?: string[];
        birthday?: string[];
      };
      username?: string;
      phonenumber?: string;
      address?: string;
      gender?: string;
      birthday?: string;
      code?: string;
      success?: boolean;
      message?: string;
      redirectTo?: string;
    }
  | undefined;

export const signup_form_schema = z.object({
  email: z.string().email({ message: "Email is required" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password is required" })
    .regex(/[a-zA-Z]/, { message: "Contain at least on letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
});

export const signin_form_schema = z.object({
  email: z.string().email({ message: "Email is required" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password is required" })
    .regex(/[a-zA-Z]/, { message: "Contain at least on letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
});

export const verify_code_form_schema = z.object({
  email: z.string().email({ message: "Email is required" }).trim(),
  code: z
    .string()
    .length(6, { message: "Code must be 6 characters long" })
    .regex(/^[0-9]+$/, { message: "Code must be a number" })
    .trim(),
});
export const resend_code_form_schema = z.object({
  email: z.string().email({ message: "Email is required" }).trim(),
  
});
export const forgot_password_form_schema = z.object({
  email: z.string().email({ message: "Email is required" }).trim(),
});

export const reset_password_form_schema = z.object({
  token: z.string().nonempty({ message: "Token is required" }).trim(),
  newPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
});

