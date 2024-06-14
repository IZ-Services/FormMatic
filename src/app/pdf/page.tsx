'use client';
import React from 'react';
// import { useEffect } from 'react';
import { useAppContext } from '@/context';
// import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DownloadPDF() {
  // const router = useRouter();
  const { pdfData } = useAppContext()!;

  // useEffect(() => {
  //   if (!pdfData) {
  //     router.push('/');
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
          PDF data not available.{' '}
          <Link href="/">
              Go back to Home
          </Link>
        </div>
      )}
    </div>
  );
}
