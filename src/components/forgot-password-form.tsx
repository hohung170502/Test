"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { forgotPassword, resetPassword } from "@/app/(auth)/_services/auth";
import { useState } from "react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // Lấy token từ URL
  const [state, action] = useActionState(
    token ? resetPassword : forgotPassword,
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(token ? 2 : 1); // Xác định bước dựa trên token

  useEffect(() => {
    if (state?.success) {
      if (step === 1) {
        toast.success(
          "Yêu cầu đặt lại mật khẩu đã được gửi thành công. Vui lòng kiểm tra email của bạn."
        );
        setStep(2); // Chuyển sang bước 2 khi email được gửi thành công
      } else if (step === 2) {
        toast.success("Mật khẩu đã được đặt lại thành công");
        router.push("/login"); // Chuyển hướng về trang đăng nhập
      }
      setIsLoading(false);
    } else if (state?.error) {
      const errorMessage = state.message || "Đã xảy ra lỗi không xác định.";
      toast.error(errorMessage);
      setIsLoading(false);
    }
  }, [state, step, router]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            {step === 1 ? "Quên mật khẩu" : "Đặt lại mật khẩu"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <form action={action} onSubmit={() => setIsLoading(true)}>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="m@example.com"
                  />
                  {state?.error?.email && (
                    <p className="text-sm text-red-500">
                      {state?.error?.email[0]}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Đang xử lý..." : "Gửi yêu cầu"}
                </Button>
              </div>
            </form>
          ) : (
            <form action={action} onSubmit={() => setIsLoading(true)}>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="newPassword">Mật khẩu mới</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    name="newPassword"
                    placeholder="Nhập mật khẩu mới"
                  />
                  {state?.error?.password && (
                    <p className="text-sm text-red-500">
                      {state?.error?.password[0]}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
