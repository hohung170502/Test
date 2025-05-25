"use client";
import Link from "next/link";
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
import { useFormState } from "react-dom";
import { signup } from "@/app/(auth)/_services/auth";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SubmitBtnLogin } from "@/components/submitBtn";
import { cn } from "@/lib/utils";

export default function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [state, action] = useActionState(signup, undefined);
  const router = useRouter();

  useEffect(() => {
    if (state?.redirectTo) {
      router.push(state.redirectTo);
    }
  }, [state, router]);
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Đăng ký</CardTitle>
        </CardHeader>

        <CardContent>
          <form action={action}>
            <div className="grid gap-6">
              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                />
                {state?.error?.email && (
                  <p className="text-sm text-red-500">{state?.error?.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="******"
                />
                {state?.error?.password && (
                  <div className="">
                    <p className="text-sm text-red-500">Password must:</p>
                    <ul>
                      {state?.error?.password?.map((error) => (
                        <li className="text-sm text-red-500" key={error}>
                          * {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <SubmitBtnLogin>Submit</SubmitBtnLogin>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4">
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
