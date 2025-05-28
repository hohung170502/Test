"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect, startTransition } from "react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/app/(auth)/_services/auth";
import { SubmitBtnLogin } from "./submitBtn";

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [state, action] = useActionState(resetPassword, undefined);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (state?.success) {
      console.log("Password reset successful:", state);
      toast.success("Mật khẩu đã được đặt lại thành công.");

      router.push("/login");
    } else if (state?.error) {
      console.error("Password reset failed:", state);
      toast.error(state.message || "Đặt lại mật khẩu thất bại.");
    }
  }, [state, router]);

  useEffect(() => {
    if (!token) {
      console.error("Token is missing from the URL.");
      toast.error("Token không hợp lệ hoặc đã hết hạn.");
    }
  }, [token]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Đặt lại mật khẩu</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={(formData) => {
              if (token) {
                formData.append("token", token);
              }
              return action(formData);
            }}
          >
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
              <SubmitBtnLogin>Đặt lại mật khẩu</SubmitBtnLogin>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
