// 'use client';
// import React from 'react';
// import { useAppContext } from '@/context';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// export default function PdfForms() {
//   const router = useRouter();
//   const { formData, setPdfData } = useAppContext()!;

//   const formNames = [
//     'ADM399/ APPLICATION FOR REFUND',
//     'BOAT101/ APPLICATION FOR REGISTRATION NUMBER, CERTIFICATE OF OWNERSHI, AND CERTIFICATE OF NUMBER FOR UNDOCUMENTED VESSEL',
//     'DMV14/ NOTICE OF CHANGE OF ADDRESS',
//     'REG5/ AFFIDAVIT FOR TRANSFER WITHOUT PROBATE CALIFORNIA TITLED VEHICLE OR VESSELS ONLY',
//     'REG17/ SPECIAL INTEREST LICENSE PLATE APPLICATION',
//     'REG17a/ SPECIAL RECOGNITION LICENSE PLATE APPLICATION',
//     'REG31/ VERIFICATION OF VEHICLE',
//     'REG65/ APPLICATION FOR VEHICLE LICENSE FEE REFUND',
//     'REG101/ STATEMENT TO RECORD OWNERSHIP',
//     'REG102/ CERTIFICATE OF NON-OPERATION ',
//     'REG135/ BILL OF SALE',
//     'REG138/ NOTICE OF TRANSFER AND RELEASE OF LIABILITY',
//     'REG156/ APPLICATION FOR REPLACEMENT PLATES, STICKERS, DOCUMENTS',
//     'REG195/ APPLICATION FOR DISABLED PERSON PLACARD OR PLATES',
//     'REG227/ APPLICATION FOR REPLACEMENT OR TRANSFER OF TITLE',
//     'REG256/ STATEMENT OF FACTS',
//     'REG256a/ MISCELLANEOUS CERTIFICATIONS',
//     'REG256f/ STATEMENT OF FACTS CALIFORNIA NON-CERTIFIED VEHICLE',
//     'REG343/ APPLICATION FOR TITLE OR REGISTRATION',
//     'REG345/ SPECIALIZED TRANSPORTATION VEHICLE EXEMPTION CERTIFICATION',
//     'REG488c/ APPLICATION FOR SALVAGE CERTIFICATE OR NONREPAIRABLE VEHICLE CERTIFICATE',
//     'REG4008/ DECLARATION OF GROSS VEHICLE WEIGHT (GVW)/COMBINED GROSS VEHICLE WEIGHT (CGW)',
//     'REG4017/ PERMANENT TRAILER IDENTIFICATION (PTI) CERTIFICATION',
//     'REG5045/ NONRESIDENT MILITARY (NRM) VEHICLE LICENSE FEE AND TRANSPORTATION IMPROVEMENT FEE EXEMPTION',
//     'REG5103/ APPLICATION FOR TEMPORARY SMOG EXEMPTION FOR A VEHICLE LOCATED OUT-OF-STATE'
//   ];

//   const handleFormClick = async (formName: string) => {
//     let selectedPdfUrl = '';
//     switch (formName) {
//       case 'ADM399/ APPLICATION FOR REFUND':
//         selectedPdfUrl = 'public/pdfs/ADM399.pdf';
//         break;
//       case 'BOAT101/ APPLICATION FOR REGISTRATION NUMBER, CERTIFICATE OF OWNERSHI, AND CERTIFICATE OF NUMBER FOR UNDOCUMENTED VESSEL':
//         selectedPdfUrl = 'public/pdfs/BOAT101.pdf';
//         break;
//       case 'DMV14/ NOTICE OF CHANGE OF ADDRESS':
//         selectedPdfUrl = 'public/pdfs/DMV14.pdf';
//         break;
//       case 'REG5/ AFFIDAVIT FOR TRANSFER WITHOUT PROBATE CALIFORNIA TITLED VEHICLE OR VESSELS ONLY':
//         selectedPdfUrl = 'public/pdfs/REG5.pdf';
//         break;
//       case 'REG17/ SPECIAL INTEREST LICENSE PLATE APPLICATION':
//         selectedPdfUrl = 'public/pdfs/REG17.pdf';
//         break;
//       case 'REG17a/ SPECIAL RECOGNITION LICENSE PLATE APPLICATION':
//         selectedPdfUrl = 'public/pdfs/REG17a.pdf';
//         break;
//       case 'REG31/ VERIFICATION OF VEHICLE':
//         selectedPdfUrl = 'public/pdfs/REG31.pdf';
//         break;
//       case 'REG65/ APPLICATION FOR VEHICLE LICENSE FEE REFUND':
//         selectedPdfUrl = 'public/pdfs/REG65.pdf';
//         break;
//       case 'REG101/ STATEMENT TO RECORD OWNERSHIP':
//         selectedPdfUrl = 'public/pdfs/REG101.pdf';
//         break;
//       case 'REG102/ CERTIFICATE OF NON-OPERATION':
//         selectedPdfUrl = 'public/pdfs/REG102.pdf';
//         break;
//       case 'REG135/ BILL OF SALE':
//         selectedPdfUrl = 'public/pdfs/REG135.pdf';
//         break;
//       case 'REG138/ NOTICE OF TRANSFER AND RELEASE OF LIABILITY':
//         selectedPdfUrl = 'public/pdfs/REG138.pdf';
//         break;
//       case 'REG156/ APPLICATION FOR REPLACEMENT PLATES, STICKERS, DOCUMENTS':
//         selectedPdfUrl = 'public/pdfs/REG156.pdf';
//         break;
//       case 'REG195/ APPLICATION FOR DISABLED PERSON PLACARD OR PLATES':
//         selectedPdfUrl = 'public/pdfs/REG195.pdf';
//         break;
//       case 'REG227/ APPLICATION FOR REPLACEMENT OR TRANSFER OF TITLE':
//         selectedPdfUrl = 'public/pdfs/REG227.pdf';
//         break;
//       case 'REG256/ STATEMENT OF FACTS':
//         selectedPdfUrl = 'public/pdfs/REG256.pdf';
//         break;
//       case 'REG256a/ MISCELLANEOUS CERTIFICATIONS':
//         selectedPdfUrl = 'public/pdfs/REG256a.pdf';
//         break;
//       case 'REG256f/ STATEMENT OF FACTS CALIFORNIA NON-CERTIFIED VEHICLE':
//         selectedPdfUrl = 'public/pdfs/REG256f.pdf';
//         break;
//       case 'REG343/ APPLICATION FOR TITLE OR REGISTRATION':
//         selectedPdfUrl = 'public/pdfs/REG343.pdf';
//         break;
//       case 'REG345/ SPECIALIZED TRANSPORTATION VEHICLE EXEMPTION CERTIFICATION':
//         selectedPdfUrl = 'public/pdfs/REG345.pdf';
//         break;
//       case 'REG488c/ APPLICATION FOR SALVAGE CERTIFICATE OR NONREPAIRABLE VEHICLE CERTIFICATE':
//         selectedPdfUrl = 'public/pdfs/REG488c.pdf';
//         break;
//       case 'REG4008/ DECLARATION OF GROSS VEHICLE WEIGHT (GVW)/COMBINED GROSS VEHICLE WEIGHT (CGW)':
//         selectedPdfUrl = 'public/pdfs/REG4008.pdf';
//         break;
//       case 'REG4017/ PERMANENT TRAILER IDENTIFICATION (PTI) CERTIFICATION':
//         selectedPdfUrl = 'public/pdfs/REG4017.pdf';
//         break;
//       case 'REG5045/ NONRESIDENT MILITARY (NRM) VEHICLE LICENSE FEE AND TRANSPORTATION IMPROVEMENT FEE EXEMPTION':
//         selectedPdfUrl = 'public/pdfs/REG5045.pdf';
//         break;
//       case 'REG5103/ APPLICATION FOR TEMPORARY SMOG EXEMPTION FOR A VEHICLE LOCATED OUT-OF-STATE':
//         selectedPdfUrl = 'public/pdfs/REG5103.pdf';
//         break;
//       default:
//         break;
//     }

//     try {
//       const response = await fetch('../api/pdfLoader', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ formData, pdfUrl: selectedPdfUrl }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Server error: ${errorText}`);
//       }

//       const data = await response.json();
//       setPdfData(data.pdfData);
//       router.push('/pdf');
//     } catch (error) {
//       console.error('Error handling form click:', error);
//     }
//   };

//   return (
//     <div>
//       <h1>Forms</h1>
//       <ul>
//         {formNames.map((formName: string, index: number) => (
//           <li key={index}>
//             <Link href={`/`} onClick={() => handleFormClick(formName)}>
//               {formName}
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
