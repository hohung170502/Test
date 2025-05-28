"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/app/(auth)/_services/auth";

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // Lấy token từ URL
  const [state, action] = useActionState(resetPassword, undefined);

  useEffect(() => {
    if (!token) {
      toast.error("Token không hợp lệ hoặc đã hết hạn.");
      router.push("/forgot-password"); // Chuyển hướng về trang quên mật khẩu
    }
  }, [token, router]);

  useEffect(() => {
    if (state?.success) {
      toast.success("Mật khẩu đã được đặt lại thành công");
      router.push("/login"); // Chuyển hướng về trang đăng nhập
    } else if (state?.error) {
      if (state.message?.toLowerCase().includes("token")) {
        toast.error("Token không hợp lệ hoặc đã hết hạn.");
        router.push("/forgot-password"); // Chuyển hướng về trang quên mật khẩu
      } else {
        toast.error(state.message);
      }
    }
  }, [state, router]);

  useEffect(() => {
    if (state?.error) {
      console.error("API Error:", state.message); // Ghi lại phản hồi từ API để kiểm tra
    }
  }, [state]);

  

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Đặt lại mật khẩu</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={action} >
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
              <Button type="submit" className="w-full">
                Đặt lại mật khẩu
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
