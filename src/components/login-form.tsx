'use client';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signin } from '@/app/(auth)/_services/auth';
import { useActionState } from 'react';
import SubmitBtn from '@/app/(auth)/_components/_ui/submitBtn';
import { BE_URL } from '@/app/(auth)/_constants/url';

export function LoginForm() {
  const [state, action] = useActionState(signin, undefined);
  return (
    <Card className='mx-auto max-w-sm'>
      <CardHeader>
        <CardTitle className='text-2xl'>Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <div className=''>
        {state?.message && (
          <p className='text-sm text-red-500'>{state?.message}</p>
        )}
      </div>
      <CardContent>
        <form
          action={action}
          className='grid gap-4'>
          <div className='grid gap-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              name='email'
              placeholder='m@example.com'
            />
            {state?.error?.email && (
              <p className='text-sm text-red-500'>{state?.error?.email}</p>
            )}
          </div>
          <div className='grid gap-2'>
            <div className='flex items-center'>
              <Label htmlFor='password'>Password</Label>
              <Link
                href='#'
                className='ml-auto inline-block text-sm underline'>
                Forgot your password?
              </Link>
            </div>
            <Input
              id='password'
              name='password'
              type='password'
              placeholder='******'
            />
            {state?.error?.password && (

              <div className="">
                <p className='text-sm text-red-500'>Password must:</p>
                <ul>
                  {state?.error?.password?.map((error) => (
                    <li className='text-sm text-red-500' key={error}>* {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <SubmitBtn>Submit</SubmitBtn>
        </form>
        {/* <Link href={`${BE_URL}/api/oauth/google/login`}>
          <Button
            variant='outline'
            className='w-full mt-2'>
            Login with Google
          </Button>
        </Link> */}
        <div className='mt-4 text-center text-sm'>
          Don&apos;t have an account?{' '}
          <Link
            href='register'
            className='underline'>
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
