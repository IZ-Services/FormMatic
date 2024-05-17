import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs/promises';
import { NextResponse } from 'next/server';

export async function GET() {
	async function modifyPdf() {
		try {
			const filePath = "/Users/akbarkhawaja//Dev/PDF-Auto-Populator/public/pdfs/Reg227.pdf"
			const existingPdfBytes = await fs.readFile(filePath);
	
			const pdfDoc = await PDFDocument.load(existingPdfBytes, { ignoreEncryption: true });
			
			
			const pdfBytes = await pdfDoc.save();
            const base64Pdf = Buffer.from(pdfBytes).toString('base64');

            return NextResponse.json({ pdfData: base64Pdf });
                   
		} 
		catch (error) {
            console.error("Error modifying PDF:", error);
           
        }
	}
	return modifyPdf()
}

