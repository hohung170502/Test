import { RegisterForm } from '@/components/register-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Metadata } from 'next';
import Link from 'next/link';
import SignupForm from '../_components/_ui/signup-form';
import { BE_URL } from '../_constants/url';
export const metadata: Metadata = {
  title: "Sign Up",
};
export default function Page() {
  return (
    <div className='flex h-screen w-full items-center justify-center px-4'>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl'>Register</CardTitle>
          <CardDescription>
            Enter your email below to Register to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm />
          <Link href={`${BE_URL}/api/v1/auth/google/login`}>
            <Button
              variant='outline'
              className='w-full mt-2'>
              Login with Google
            </Button>
          </Link>
          <div className='mt-4 text-center text-sm'>
            Already have an account?
            <Link
              href='login'
              className='underline'>
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>

  )
}
