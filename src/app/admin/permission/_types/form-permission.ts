import {z} from 'zod';


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
      data?: any; 

    }
  | undefined;

export const permission_form_schema = z.object({

    name: z.string().min(1, "Tên quyền không được để trống"),
    description: z.string().min(1, "Mô tả không được để trống"),

  });