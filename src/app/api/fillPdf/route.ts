import { PDFDocument, PDFTextField, PDFCheckBox, PDFDropdown, PDFDict, PDFArray, PDFName } from 'pdf-lib';
import connectDB from '@/lib/mongoDB';
import TransactionModel from '../../../models/transaction';
import { NextResponse } from 'next/server';

// Define the FormData type structure
type FormData = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  middleName: string;
  licenseNumber: string;
  state: string;
  purchaseDate: string;
  purchaseValue: string;
  isGift: string;
  isTrade: string;
};

export async function POST(request: Request) {
  console.log(`[fillPdf] Request received`);

  try {
    // Connect to the database
    await connectDB();
    console.log(`[fillPdf] Connected to the database`);

    const { transactionId } = await request.json();
    console.log(`[fillPdf] Received transactionId: ${transactionId}`);

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID is required.' },
        { status: 400 }
      );
    }

    // Retrieve the transaction
    const transaction = await TransactionModel.findById(transactionId);
    if (!transaction) {
      console.log(`[fillPdf] Transaction not found`);
      return NextResponse.json(
        { error: 'Transaction not found.' },
        { status: 404 }
      );
    }

    const formUrl = 'https://www.dmv.ca.gov/portal/uploads/2021/11/REG-227-R9-2021-AS-WWW.pdf';
    console.log(`[fillPdf] Fetching PDF form from: ${formUrl}`);
    const formResponse = await fetch(formUrl);
    const formBytes = await formResponse.arrayBuffer();

    // Load the PDF
    const pdfDoc = await PDFDocument.load(formBytes, { ignoreEncryption: true });
    console.log(`[fillPdf] Loaded PDF document.`);

    const form = pdfDoc.getForm();

    // Hardcoded field mappings
    const fieldMapping: { [key in keyof FormData]: string } = {
      firstName: '1 True Full Name, Last',
      lastName: 'FieldlastName',
      phoneNumber: 'FieldNameForPhoneNumber',
      middleName: 'FieldNameForMiddleName',
      licenseNumber: 'FieldNameForLicenseNumber',
      state: 'FieldNameForState',
      purchaseDate: 'FieldNameForPurchaseDate',
      purchaseValue: 'FieldNameForPurchaseValue',
      isGift: 'FieldNameForIsGift',
      isTrade: 'FieldNameForIsTrade',
    };

    const formData: FormData = transaction.formData;
    console.log(`[fillPdf] Form data: ${JSON.stringify(formData)}`);

    // Helper function to inspect field metadata dynamically
    const debugFields = () => {
      const fields = form.getFields();
      fields.forEach((field) => {
        console.log(`Field Name: ${field.getName()}, Field Type: ${field.constructor.name}`);
      });
    };

    console.log('[fillPdf] Inspecting form fields:');
    debugFields();

    // Populate fields
    Object.keys(fieldMapping).forEach((key) => {
      const fieldName = fieldMapping[key as keyof FormData];
      const fieldValue = formData[key as keyof FormData];

      console.log(`[fillPdf] Mapping field "${key}" to PDF field "${fieldName}" with value: ${fieldValue}`);

      try {
        const field = form.getField(fieldName);
        if (field instanceof PDFTextField) {
          field.setText(String(fieldValue || ''));
        } else if (field instanceof PDFCheckBox) {
          if (typeof fieldValue === 'boolean') {
            fieldValue ? field.check() : field.uncheck();
          }
        } else if (field instanceof PDFDropdown) {
          field.select(String(fieldValue || ''));
        } else {
          console.log(`[fillPdf] Field "${fieldName}" is not a valid PDF field type.`);
        }
      } catch (error) {
        console.warn(`[fillPdf] Field "${fieldName}" not found or unsupported:`, error);
      }
    });

    // Flatten the form (make it non-editable)
    form.flatten();
    console.log(`[fillPdf] Flattened the form.`);

    // Save the filled PDF
    const pdfBytes = await pdfDoc.save();
    console.log(`[fillPdf] Saved the filled PDF.`);

    // Return the filled PDF as a response
    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="filled_form.pdf"',
      },
    });
  } catch (error) {
    console.error(`[fillPdf] Error:`, error);
    return NextResponse.json(
      { error: 'Internal server error. Could not process the PDF.' },
      { status: 500 }
    );
  }
}
