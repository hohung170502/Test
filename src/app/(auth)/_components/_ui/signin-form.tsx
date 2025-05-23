'use client';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signin } from '@/app/(auth)/_services/auth';
import { useActionState } from 'react';
import SubmitBtn from '@/app/(auth)/_components/_ui/submitBtn';

export function SigninForm() {
    const [state, action] = useActionState(signin, undefined);
    return (
        <>
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
                        <div className=''>
                            <p className='text-sm text-red-500'>Password must:</p>
                            <ul>
                                {state?.error?.password?.map((error) => (
                                    <li
                                        className='text-sm text-red-500'
                                        key={error}>
                                        * {error}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <div className=''>
                    {state?.message && (
                        <p className='text-sm text-red-500'>{state?.message}</p>
                    )}
                </div>
                <SubmitBtn>Submit</SubmitBtn>
            </form>
        </>
    );
}
