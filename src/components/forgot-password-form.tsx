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
import { useRouter } from "next/navigation";
import { forgotPassword } from "@/app/(auth)/_services/auth";
import { useState } from "react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const [state, action] = useActionState(forgotPassword, undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (state?.success) {
      toast.success(
        "Yêu cầu đặt lại mật khẩu đã được gửi thành công. Vui lòng kiểm tra email của bạn."
      );
      setIsLoading(false);
      // Loại bỏ router.push để không tự động chuyển hướng
    } else if (state?.error) {
      toast.error(state.message);
      setIsLoading(false);
    }
  }, [state, router]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Quên mật khẩu</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
}
