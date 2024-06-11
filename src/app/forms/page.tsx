'use client';
import React from 'react';
import { useAppContext } from '@/context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PdfForms() {
  const router = useRouter();
  const { formData, setPdfData } = useAppContext()!;

  const formNames = [
    'REG101/ STATEMENT TO RECORD OWNERSHIP',
    'REG156/ APPLICATION FOR REPLACEMENT PLATES, STICKERS, DOCUMENTS',
    'REG227/ APPLICATION FOR REPLACEMENT OR TRANSFER OF TITLE',
    'REG256/ STATEMENT OF FACTS',
    'REG343/ APPLICATION FOR TITLE OR REGISTRATION',
    'REG488c/ APPLICATION FOR SALVAGE CERTIFICATE OR NONREPAIRABLE VEHICLE CERTIFICATE',
    'REG4008/ DECLARATION OF GROSS VEHICLE WEIGHT (GVW)/COMBINED GROSS VEHICLE WEIGHT (CGW)',
    'REG4017/ PERMANENT TRAILER IDENTIFICATION (PTI) CERTIFICATION',
  ];

  const handleFormClick = async (formName: string) => {
    let selectedPdfUrl = '';
    switch (formName) {
      case 'REG101/ STATEMENT TO RECORD OWNERSHIP':
        selectedPdfUrl = 'public/pdfs/REG101.pdf';
        break;
      case 'REG156/ APPLICATION FOR REPLACEMENT PLATES, STICKERS, DOCUMENTS':
        selectedPdfUrl = 'public/pdfs/REG156.pdf';
        break;
      case 'REG227/ APPLICATION FOR REPLACEMENT OR TRANSFER OF TITLE':
        selectedPdfUrl = 'public/pdfs/REG227.pdf';
        break;
      case 'REG256/ STATEMENT OF FACTS':
        selectedPdfUrl = 'public/pdfs/REG256.pdf';
        break;
      case 'REG343/ APPLICATION FOR TITLE OR REGISTRATION':
        selectedPdfUrl = 'public/pdfs/REG343.pdf';
        break;
      case 'REG488c/ APPLICATION FOR SALVAGE CERTIFICATE OR NONREPAIRABLE VEHICLE CERTIFICATE':
        selectedPdfUrl = 'public/pdfs/REG488c.pdf';
        break;
      case 'REG4008/ DECLARATION OF GROSS VEHICLE WEIGHT (GVW)/COMBINED GROSS VEHICLE WEIGHT (CGW)':
        selectedPdfUrl = 'public/pdfs/REG4008.pdf';
        break;
      case 'REG4017/ PERMANENT TRAILER IDENTIFICATION (PTI) CERTIFICATION':
        selectedPdfUrl = 'public/pdfs/REG4017.pdf';
        break;
      default:
        break;
    }

    try {
      const response = await fetch('../api/pdfLoader', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData, pdfUrl: selectedPdfUrl }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${errorText}`);
      }

      const data = await response.json();
      setPdfData(data.pdfData);
      router.push('/pdf');
    } catch (error) {
      console.error('Error handling form click:', error);
    }
  };

  return (
    <div>
      <h1>Forms</h1>
      <ul>
        {formNames.map((formName: string, index: number) => (
          <li key={index}>
            <Link href={`/`} onClick={() => handleFormClick(formName)}>
              {formName}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
