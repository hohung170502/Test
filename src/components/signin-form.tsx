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
import { signin } from "@/app/(auth)/_services/auth";
import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SubmitBtnLogin } from "./submitBtn";
export function SigninForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter(); // Initialize router

  // const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  // const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;
  // if (!clientId || !redirectUri) {
  //   throw new Error("Missing required environment variables.");
  // }
  const [state, action] = useActionState(signin, undefined);
  useEffect(() => {
    if (state?.success) {
      toast.success("Đăng nhập thành công");
      router.push("/"); // Chuyển hướng nếu đăng nhập thành công
    } else if (state?.error) {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Đăng nhập hệ thống</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={action}>
            <div className="grid gap-6">
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
                      {state?.error?.email}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="******"
                    autoComplete="current-password" // Thêm dòng này
                  />
                  {state?.error?.password && (
                    <ul>
                      {state?.error?.password?.map((error: any) => (
                        <li className="text-sm text-red-500" key={error}>
                          * {error}
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="font-medium text-gray-900 text-sm text-right ">
                    <Link href="/forgot-password" className="hover:underline">
                      Quên mật khẩu?
                    </Link>
                  </p>
                </div>
                <SubmitBtnLogin>Đăng nhập</SubmitBtnLogin>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
function CicrcleCheck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      className="text-green-500"
      width="24"
      height="24"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.49991 0.877045C3.84222 0.877045 0.877075 3.84219 0.877075 7.49988C0.877075 11.1575 3.84222 14.1227 7.49991 14.1227C11.1576 14.1227 14.1227 11.1575 14.1227 7.49988C14.1227 3.84219 11.1576 0.877045 7.49991 0.877045ZM1.82708 7.49988C1.82708 4.36686 4.36689 1.82704 7.49991 1.82704C10.6329 1.82704 13.1727 4.36686 13.1727 7.49988C13.1727 10.6329 10.6329 13.1727 7.49991 13.1727C4.36689 13.1727 1.82708 10.6329 1.82708 7.49988ZM10.1589 5.53774C10.3178 5.31191 10.2636 5.00001 10.0378 4.84109C9.81194 4.68217 9.50004 4.73642 9.34112 4.96225L6.51977 8.97154L5.35681 7.78706C5.16334 7.59002 4.84677 7.58711 4.64973 7.78058C4.45268 7.97404 4.44978 8.29061 4.64325 8.48765L6.22658 10.1003C6.33054 10.2062 6.47617 10.2604 6.62407 10.2483C6.77197 10.2363 6.90686 10.1591 6.99226 10.0377L10.1589 5.53774Z"
        fill="currentColor"
      ></path>
    </svg>
  );
}
function FaExclamationCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6 text-white"
    >
      <path
        fillRule="evenodd"
        d="M11.25 3.75a7.5 7.5 0 1 0 7.5 7.5 7.5 7.5 0 0 0-7.5-7.5zM2.25 11.25a9 9 0 1 1 18 0 9 9 0 0 1-18 0zm9-4.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5a.75.75 0 0 1 .75-.75zm.75 8.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}
