import { LoginForm } from "@/components/login-form";
import { getSession } from "../lib/session";
import { Metadata } from "next";
import { BE_URL } from "../_constants/url";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SigninForm } from "../_components/_ui/signin-form";
export const metadata: Metadata = {
  title: "Sign In",
};
export default async function Page() {
  const session = await getSession();
  if (session) {
    return <div>You are already logged in.</div>;
  }
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SigninForm />
          <Link href="#" aria-disabled>
            <Button variant="outline" className="w-full mt-2" disabled>
              Login with Google (coming soon)
            </Button>
          </Link>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="register" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
