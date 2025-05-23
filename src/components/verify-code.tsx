"use client";
import { useActionState, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { verifyCode } from "@/app/(auth)/_services/auth";
import { toast } from "sonner";

export default function VerifyCodePage() {
  const [state, action] = useActionState(verifyCode, undefined);
  const router = useRouter(); // Initialize router
  useEffect(() => {
    if (state?.success) {
      toast.success("Xác thực thành công!");
      router.push("/"); // Chuyển hướng nếu đăng nhập thành công
    } else if (state?.error) {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <form
        action={action}
        className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md flex flex-col gap-6 border border-gray-100"
      >
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-2xl font-bold text-indigo-700">Xác thực Email</h2>
          <p className="text-gray-500 text-sm text-center">
            Nhập mã xác thực đã gửi về email của bạn
          </p>
        </div>
        <div className="flex flex-col items-center gap-4">
          <Label htmlFor="code" className="sr-only">
            Mã xác thực
          </Label>
          <InputOTP
            maxLength={6}
            name="code"
            id="code"
            autoFocus
            className="flex justify-center gap-2"
          >
            <InputOTPGroup className="flex gap-3">
              {[...Array(6)].map((_, i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="w-12 h-12 text-xl border-2 border-gray-300 rounded-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-150 bg-gray-50"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
        >
          Xác thực
        </Button>
        {state?.message && (
          <p
            className={`text-center text-sm ${
              state.message.includes("thành công")
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {state.message}
          </p>
        )}
      </form>
    </div>
  );
}
