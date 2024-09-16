'use client';
import React from 'react';
import { useEffect } from 'react';
import { useAppContext } from '@/context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserAuth } from '@/context/AuthContext';

export default function DownloadPDF() {
  const { pdfData } = useAppContext()!;
  const { user, isSubscribed } = UserAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/');
    } else if (!isSubscribed) {
      router.push('/signUp');
    }
  }, [user, isSubscribed, router]);

  // useEffect(() => {
  //   if (!pdfData) {
  //     router.push('/home');
  //   }
  // }, [pdfData, router]);

  return (
    <div>
      {pdfData ? (
        <object
          type="application/pdf"
          width="100%"
          height="600px"
          data={`data:application/pdf;base64,${pdfData}`}
        />
      ) : (
        <div>
          PDF data not available. <Link href="/">Go back to Home</Link>
        </div>
      )}
    </div>
  );
}
