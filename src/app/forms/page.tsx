"use client"
import { useAppContext } from '@/context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PdfForms() {
	const router = useRouter();
	const { pdfUrl, formData, setPdfUrl, setPdfData } = useAppContext()!;

	const formNames = [
		'Reg101/ STATEMENT TO RECORD OWNERSHIP',
		'Reg156/ APPLICATION FOR REPLACEMENT PLATES, STICKERS, DOCUMENTS',
		'Reg227/ APPLICATION FOR REPLACEMENT OR TRANSFER OF TITLE',
		'Reg256/ STATEMENT OF FACTS',
		'Reg343/ APPLICATION FOR TITLE OR REGISTRATION',
		'Reg488c/ APPLICATION FOR SALVAGE CERTIFICATE OR NONREPAIRABLE VEHICLE CERTIFICATE',
		'Reg4008/ DECLARATION OF GROSS VEHICLE WEIGHT (GVW)/COMBINED GROSS VEHICLE WEIGHT (CGW)',
		'Reg4017/ PERMANENT TRAILER IDENTIFICATION (PTI) CERTIFICATION',
	];

	const handleFormClick = async (formName: string) => {
		let selectedPdfUrl = '';
		switch (formName) {
		case 'Reg101/ STATEMENT TO RECORD OWNERSHIP':
			selectedPdfUrl = 'public/pdfs/Reg101.pdf';
			break;
		case 'Reg156/ APPLICATION FOR REPLACEMENT PLATES, STICKERS, DOCUMENTS':
			selectedPdfUrl = 'public/pdfs/Reg156.pdf';
			break;
		case 'Reg227/ APPLICATION FOR REPLACEMENT OR TRANSFER OF TITLE':
			selectedPdfUrl = 'public/pdfs/Reg227.pdf';
			break;
		case 'Reg256/ STATEMENT OF FACTS':
			selectedPdfUrl = 'public/pdfs/Reg256.pdf';
			break;
		case 'Reg343/ APPLICATION FOR TITLE OR REGISTRATION':
			selectedPdfUrl = 'public/pdfs/Reg343.pdf';
			break;
		case 'Reg488c/ APPLICATION FOR SALVAGE CERTIFICATE OR NONREPAIRABLE VEHICLE CERTIFICATE':
			selectedPdfUrl = 'public/pdfs/Reg488c.pdf';
			break;
		case 'Reg4008/ DECLARATION OF GROSS VEHICLE WEIGHT (GVW)/COMBINED GROSS VEHICLE WEIGHT (CGW)':
			selectedPdfUrl = 'public/pdfs/Reg4008.pdf';
			break;
		case 'Reg4017/ PERMANENT TRAILER IDENTIFICATION (PTI) CERTIFICATION':
			selectedPdfUrl = 'public/pdfs/Reg4017.pdf';
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
				console.error("Error handling form click:", error);
			}
		};

	return (
		<div>
			<h1>Reg Forms</h1>
			<ul>
				{formNames.map((formName: string, index: number) => (
					<li key={index}>
						<Link href={`/`}onClick={() => handleFormClick(formName)}>
							{formName}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
