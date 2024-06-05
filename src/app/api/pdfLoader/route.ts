import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.json();

	async function modifyPdf() {
		try {
			const filePath = "/Users/akbarkhawaja//Dev/PDF-Auto-Populator/public/pdfs/dmv262.pdf"
			const existingPdfBytes = await fs.readFile(filePath);
	
			const pdfDoc = await PDFDocument.load(existingPdfBytes, { ignoreEncryption: true });
						
			const form = pdfDoc.getForm();
			//  const allFields = form.getFields();

        	// console.log("Fields in the PDF form:", allFields.map(field => field.getName()));
				 const yearMakeField = form.getTextField('Year/Make'); // Assuming 'Year/Make' is the name of the field
            yearMakeField.setText(formData.vehicleMake); // Setting the value from formData


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

