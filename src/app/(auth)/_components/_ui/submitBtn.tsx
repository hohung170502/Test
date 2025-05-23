'use client';
import { Button } from '@/components/ui/button';
import React, { PropsWithChildren } from 'react';
import { useFormStatus } from 'react-dom';

const SubmitBtn: React.FC<PropsWithChildren> = ({ children }) => {
    const { pending } = useFormStatus();

    return (
        <Button
            type='submit'
            aria-disabled={pending}
            className='flex items-center justify-center w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
            {pending ? 'Submitting...' : children}
        </Button>
    );
};

export default SubmitBtn;
