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
import SubmitBtn from "@/app/(auth)/_components/_ui/submitBtn";
import { useFormState } from "react-dom";
import { signup } from "@/app/(auth)/_services/auth";
import { useActionState } from "react";

export function RegisterForm() {
  const [state, action] = useActionState(signup, undefined);
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Register</CardTitle>
        <CardDescription>
          Enter your email below to Register to your account
        </CardDescription>
        <div className="">
          {state?.message && (
            <p className="text-sm text-red-500">{state?.message}</p>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form action={action} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              name="email"
            />
            {state?.error?.email && (
              <p className="text-sm text-red-500">{state?.error?.email}</p>
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link>
            </div>
            <Input id="password" name="password" type="password" />
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

          {/* <Button type="submit" className="w-full">
                        Login
                    </Button> */}
          <SubmitBtn>Submit</SubmitBtn>
          <Button variant="outline" className="w-full">
            Login with Google
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?
          <Link href="login" className="underline">
            Sign In
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
