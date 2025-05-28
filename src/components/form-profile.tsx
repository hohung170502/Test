"use client";
import React, { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { cn } from "@/lib/utils";

import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { profile, updateAvatar } from "@/app/admin/profile/_services/profile";

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  bio: z
    .string()
    .min(10, {
      message: "Bio must be at least 10 characters.",
    })
    .max(160, {
      message: "Bio must not be longer than 30 characters.",
    }),
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email(),
  type: z.enum(["all", "mentions", "none"], {
    required_error: "You need to select a notification type.",
  }),
  mobile: z.boolean().default(false).optional(),
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
  marketing_emails: z.boolean().default(false).optional(),
  security_emails: z.boolean(),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Vui lòng chọn giới tính.",
  }),
  phonenumber: z
    .string()
    .min(10, {
      message: "Số điện thoại phải có ít nhất 10 ký tự.",
    })
    .max(15, {
      message: "Số điện thoại không được dài hơn 15 ký tự.",
    }),

  avatar: z.string().optional(),
});

export function FormDemo() {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      email: "",
      dob: undefined,
      gender: undefined,
      avatar: "",
      phonenumber: "",
      items: ["recents", "home"],
    },
  });

  useEffect(() => {
    async function fetchProfile() {
      const res = await profile({}, new FormData());
      if (res?.success && res.data) {
        form.reset({
          username: res.data.username || "",
          email: res.data.email || "",
          dob: res.data.birthday ? new Date(res.data.birthday) : undefined,
          gender: (() => {
            const g = res.data.gender?.toLowerCase().trim();
            if (g === "nam" || g === "name") return "male";
            if (g === "nữ" || g === "nu") return "female";
            if (g === "khác" || g === "khac") return "other";
            return undefined;
          })(),
          avatar: res.data.avatar || "",
          phonenumber: res.data.phonenumber || "",
        });
      }
    }
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Ảnh đại diện */}
        <div className="mt-4">
          <Label className="block mb-2 text-base font-medium">
            Ảnh đại diện
          </Label>
          <div className="flex items-start gap-6 mb-6">
            <Avatar className="h-16 w-16 rounded-lg border">
              <AvatarImage
                src={form.watch("avatar") || "/default-avatar.png"}
                alt="avatar"
                className="object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "/default-avatar.png";
                }}
              />
              <AvatarFallback className="rounded-lg">
                {/* Có thể để trống hoặc hiện icon/avatar mặc định */}
              </AvatarFallback>
            </Avatar>
            <div>
              <label htmlFor="avatar-upload">
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
                id="avatar-upload"
                name="avatar"
                type="file"
                accept="image/png, image/jpeg"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const formData = new FormData();
                    formData.append("file", file);

                    const res = await updateAvatar({}, formData);
                    if (res?.success) {
                      toast.success("Cập nhật ảnh đại diện thành công!");
                      // Nếu BE trả về URL mới, nên dùng URL đó
                      const newAvatarUrl =
                        res.data?.avatar || URL.createObjectURL(file);
                      form.setValue("avatar", newAvatarUrl);
                    } else {
                      toast.error(
                        res?.message || "Cập nhật ảnh đại diện thất bại!"
                      );
                    }
                  }
                }}
              />
              <div className="text-xs text-muted-foreground mt-1">
                Dung lượng file tối đa 5 MB.
                <br />
                Định dạng: <b>.JPEG, .PNG</b>
              </div>
            </div>
          </div>
        </div>
        {/* Họ tên & số điện thoại */}
        <div className="grid grid-cols-2 gap-4 ">
          <div>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="username">
                    Họ và tên <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="username"
                    {...field}
                    placeholder=""
                    className="hover:border-blue-500 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="phonenumber"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="phonenumber">
                  Số điện thoại <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phonenumber"
                  {...field}
                  placeholder=""
                  className="hover:border-blue-500 focus:border-blue-500 focus:ring-blue-500"
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Email & ngày sinh */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    {...field}
                    placeholder="m@example.com"
                    className="hover:border-blue-500 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mt-2">
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Ngày sinh</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            " pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>dsds</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        {/* Giới tính */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giới tính</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Nam</SelectItem>
                    <SelectItem value="female">Nữ</SelectItem>
                    <SelectItem value="other">Khác</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-center justify-between mt-4">
          <button
            type="button"
            className="text-blue-600 text-sm focus:outline-none"
            onClick={() => setShowPasswordForm((v) => !v)}
          >
            Thay đổi mật khẩu
          </button>
        </div>
        {/* Animation collapse/expand */}
        <div
          className={`overflow-hidden transition-all duration-500 ${
            showPasswordForm ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="grid gap-2 mt-4">
            <div className="flex items-center mb-2">
              <Label htmlFor="password">Mật khẩu</Label>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="******"
              className="hover:border-blue-500 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <div className="flex items-center mb-2">
                <Label htmlFor="new-password">Mật khẩu mới</Label>
              </div>
              <Input
                id="new-password"
                name="new-password"
                type="password"
                placeholder="******"
                className="hover:border-blue-500 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <div className="flex items-center mb-2">
                <Label htmlFor="confirm-password">Nhập mật khẩu mới</Label>
              </div>
              <Input
                id="confirm-password"
                name="confirm-password"
                type="password"
                placeholder="******"
                className="hover:border-blue-500 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              onClick={() => setShowPasswordForm(false)}
            >
              Thay đổi mật khẩu
            </button>
          </div>
        </div>
      </form>
    </Form>
  );
}
