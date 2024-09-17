'use client';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useAppContext } from '@/context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserAuth } from '@/context/AuthContext';
import  Loading  from '../../components/pages/Loading';

export default function DownloadPDF() {
  const { pdfData } = useAppContext()!;
  const { user, isSubscribed } = UserAuth();
  const [loading, setLoading] = useState(true); 
  const router = useRouter();
  
  useEffect(() => {
    if (!user) {
      router.push('/');
    } else if (!isSubscribed) {
      router.push('/signUp');
    } else {
      setLoading(false); 
    }
  }, [user, isSubscribed, router]);

  if (loading) {
    return <Loading />;
  }

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
