import { z } from "zod";
export type FormState =
  | {
      error?: {
        email?: string[];
        password?: string[];
      };
      success?: boolean;
      message?: string;
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
