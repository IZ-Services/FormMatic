"use client"
import { useEffect } from 'react';
import { useAppContext } from '@/context';
import { useRouter } from 'next/navigation';

export default function DownloadPDF() {
  const router = useRouter();
  const { pdfData } = useAppContext()!;

  useEffect(() => {
    if (!pdfData) {
      router.push('/');
    }
  }, [pdfData, router]);

  return (
    <div>
      {pdfData && (
        <object
          type="application/pdf"
          width="100%"
          height="600px"
          data={`data:application/pdf;base64,${pdfData}`}
        >
          Your browser does not support PDFs.
        </object>
      )}
    </div>
  );
}
