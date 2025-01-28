import connectDB from '@/lib/mongoDB';
import TransactionModel from '../../../models/transaction';
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { PDFDocument, PDFName, PDFBool } from 'pdf-lib';

interface ProcessedFormData {
  vehicleLicensePlateNumber: string;
  vehicleVinNumber: string;
  vehicleMake: string;
  owner1FullName: string;
  owner1LicenseNumber: string;
  owner1State: string;
  owner1Phone: string;
  owner1PurchaseDate: string;
  owner1PurchaseValue: string;
  isGift: boolean;
  isTrade: boolean;
  owner2FullName?: string;
  owner2LicenseNumber?: string;
  owner2State?: string;
  address: AddressData;
  mailingAddress?: MailingAddressData;
  lesseeAddress?: LesseeAddressData;
  trailerLocation?: TrailerLocationData;
  lienHolder?: LienHolderData;
  vehicleYear: string;
  vehicleMileage: string;
  notActualMileage: boolean;
  exceedsMechanicalLimit: boolean;
  odometerDiscrepancyExplanation?: string;
}

interface AddressData {
  street: string;
  apt?: string;
  city: string;
  state: string;
  zip: string;
}

interface MailingAddressData {
  street: string;
  poBox?: string;
  city: string;
  state: string;
  zip: string;
}

interface LesseeAddressData {
  street: string;
  apt?: string;
  city: string;
  state: string;
  zip: string;
}

interface TrailerLocationData {
  street: string;
  apt?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface LienHolderData {
  name: string;
  eltNumber: string;
  address: AddressData;
  mailingAddress?: MailingAddressData;
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const requestData: { transactionId: string; pdfUrl?: string } = await request.json();
    const { transactionId, pdfUrl } = requestData;

    if (!transactionId) {
      return NextResponse.json({ error: 'Transaction ID is required.' }, { status: 400 });
    }

    const resolvedPdfUrl = path.resolve(process.cwd(), pdfUrl || 'public/pdfs/REG227.pdf');
    const transaction = await TransactionModel.findById(transactionId);
    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found.' }, { status: 404 });
    }

    const formData = transaction.formData as ProcessedFormData;
    const pdfBytes = await modifyReg227Pdf(resolvedPdfUrl, formData);

    return new Response(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="filled-reg227-form.pdf"',
      },
    });
  } catch (error) {
    console.error(`[fillReg227] Error:`, error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

async function modifyReg227Pdf(fileUrl: string, formData: ProcessedFormData): Promise<Uint8Array> {
  const existingPdfBytes = await fs.readFile(fileUrl);
  const pdfDoc = await PDFDocument.load(existingPdfBytes, { ignoreEncryption: true });
  const form = pdfDoc.getForm();

  // Utility function for setting text fields safely
  const safeSetText = (fieldName: string | string[], value: string) => {
    try {
      if (Array.isArray(fieldName)) {
        fieldName.forEach((name) => {
          const field = form.getTextField(name);
          field.setText(value || '');
        });
      } else {
        const field = form.getTextField(fieldName);
        field.setText(value || '');
      }
    } catch (error) {
      console.warn(`Field not found: ${fieldName}`);
    }
  };

  // Utility function for setting checkbox fields safely
  const safeSetCheckbox = (fieldName: string, value: boolean) => {
    try {
      const checkbox = form.getCheckBox(fieldName);
      value ? checkbox.check() : checkbox.uncheck();
    } catch (error) {
      console.warn(`Checkbox not found: ${fieldName}`);
    }
  };

  const fieldMapping: Record<string, string | string[] | Record<string, string>> = {
    vehicleLicensePlateNumber: 'License Plate/CF Number1',
    vehicleVinNumber: 'Vehicle/Vessel ID/Number1',
    vehicleYear: 'Year/Make',
    vehicleMileage: 'Odometer',
    notActualMileage: 'Not Actual Mileage Checkbox',
    exceedsMechanicalLimit: 'Exceeds Mechanical Limit Checkbox',
    odometerDiscrepancyExplanation: 'Odometer Explanation',
    owner1FullName: '1 True Full Name, Last',
    owner1LicenseNumber: '1 DL/ID Number-1.0',
    owner1State: 'state.1',
    owner1Phone: 'Daytime Telephone_1',
    owner1PurchaseDate: '6 Purchase Price/Market Value',
    owner1PurchaseValue: 'Purchase price',
    isGift: 'Gift Box',
    isTrade: 'Gift Box1',
    address: {
      street: '1 Residence or Business Address.0',
      apt: '1 Apt/Space Number-1',
      city: '1 City-1',
      state: '1 States1',
      zip: '1 Zip Code-1',
    },
    mailingAddress: {
      street: '1 Mailing Address',
      poBox: '1 Apt/Space Number-2',
      city: '1 City-2',
      state: '1 States2',
      zip: '1 Zip Code-2.0',
    },
  };

  for (const [key, pdfField] of Object.entries(fieldMapping)) {
    const value = (formData as any)[key];
    if (value !== undefined) {
      if (typeof pdfField === 'string' || Array.isArray(pdfField)) {
        safeSetText(pdfField, value);
      } else {
        for (const [fieldKey, fieldPath] of Object.entries(pdfField)) {
          safeSetText(fieldPath, value[fieldKey]);
        }
      }
    }
  }

  // Update checkbox fields
  safeSetCheckbox('Not Actual Mileage Checkbox', formData.notActualMileage);
  safeSetCheckbox('Exceeds Mechanical Limit Checkbox', formData.exceedsMechanicalLimit);

  // Update PDF appearance settings
  form.updateFieldAppearances();
  pdfDoc.catalog.set(PDFName.of('NeedAppearances'), PDFBool.True);

  return pdfDoc.save();
}

// Helper Functions
function formatOwnerName(owner: { firstName: string; lastName: string; middleName?: string }): string {
  return [owner.lastName, owner.firstName, owner.middleName].filter(Boolean).join(', ');
}

function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });
}

function formatCurrency(value: string | number): string {
  const numericValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
  return numericValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}


function formatPhoneNumber(phone: string): string[] {
  const cleaned = ('' + phone).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  return match ? [match[1], match[2], match[3]] : ['', '', ''];
}

function splitDate(dateString: string): { month: number; day: number; year: number } {
  const date = new Date(dateString);
  return {
    month: date.getMonth() + 1,
    day: date.getDate(),
    year: date.getFullYear()
  };
}