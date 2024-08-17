import { PDFDocument } from 'pdf-lib';
import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { FormData } from '@/context';
import path from 'path';

export async function POST(request: NextRequest) {
  const { formData, pdfUrl } = await request.json();

  async function modifyPdf() {
    try {
      let base64Pdf;
      const absolutePdfPath = path.resolve(pdfUrl);

      switch (pdfUrl) {
        case 'public/pdfs/REG101.pdf':
          base64Pdf = await modifyReg101Pdf(absolutePdfPath, formData);
          break;
        case 'public/pdfs/REG156.pdf':
          base64Pdf = await modifyReg156Pdf(absolutePdfPath, formData);
          break;
        case 'public/pdfs/REG227.pdf':
          base64Pdf = await modifyReg227Pdf(absolutePdfPath, formData);
          break;
        case 'public/pdfs/REG256.pdf':
          base64Pdf = await modifyReg256Pdf(absolutePdfPath, formData);
          break;
        case 'public/pdfs/REG343.pdf':
          base64Pdf = await modifyReg343Pdf(absolutePdfPath, formData);
          break;
        case 'public/pdfs/REG488C.pdf':
          base64Pdf = await modifyReg488cPdf(absolutePdfPath, formData);
          break;
        case 'public/pdfs/REG4008.pdf':
          base64Pdf = await modifyReg4008Pdf(absolutePdfPath, formData);
          break;
        case 'public/pdfs/REG4017.pdf':
          base64Pdf = await modifyReg4017Pdf(absolutePdfPath, formData);
          break;
        default:
          throw new Error('Unknown form');
      }
      return NextResponse.json({ pdfData: base64Pdf });
    } catch (error) {
      console.error(`Unknown form URL: ${pdfUrl}`);
      return NextResponse.error();
    }
  }
  return modifyPdf();
}

async function modifyReg101Pdf(fileUrl: string, formData: FormData) {
  const data = formData;
  
  const existingPdfBytes = await fs.readFile(fileUrl);

  const pdfDoc = await PDFDocument.load(existingPdfBytes, { ignoreEncryption: true });

  const form = pdfDoc.getForm();

  const allFields = form.getFields();

  const pdfBytes = await pdfDoc.save();
  const base64Pdf = Buffer.from(pdfBytes).toString('base64');

  return base64Pdf;
}

async function modifyReg156Pdf(fileUrl: string, formData: FormData) {
  const data = formData;

  const existingPdfBytes = await fs.readFile(fileUrl);

  const pdfDoc = await PDFDocument.load(existingPdfBytes, { ignoreEncryption: true });

  const form = pdfDoc.getForm();

  const allFields = form.getFields();


  const pdfBytes = await pdfDoc.save();
  const base64Pdf = Buffer.from(pdfBytes).toString('base64');

  return base64Pdf;
}

async function modifyReg227Pdf(fileUrl: string, formData: FormData) {
  const existingPdfBytes = await fs.readFile(fileUrl);

  const pdfDoc = await PDFDocument.load(existingPdfBytes, { ignoreEncryption: true });

  const form = pdfDoc.getForm();

  const allFields = form.getFields();


  const licensePlateNumberField1 = form.getTextField('License Plate/CF Number1');
  licensePlateNumberField1.setText(formData.vehicleLicensePlateNumber || '');

  const vehicleIdNumberField1 = form.getTextField('Vehicle/Vessel ID/Number1');
  vehicleIdNumberField1.setText(formData.vehicleVinNumber || '');

  const yearMakeField = form.getTextField('Year/Make');
  yearMakeField.setText(formData.vehicleMake || '');

  const constructFullName = (lastName: string, firstName: string, middleName: string) => {
    const lastNamePart = lastName || '';
    const middleNamePart = middleName ? `, ${middleName}` : '';
    const firstNamePart = firstName ? `, ${firstName}` : '';
    return `${lastNamePart}${firstNamePart}${middleNamePart}`.trim();
  };

  const fullNameField1 = form.getTextField('1 True Full Name, Last');
  const fullName1 = constructFullName(
    formData.lastName1,
    formData.firstName1,
    formData.middleName1,
  );
  fullNameField1.setText(fullName1);

  const licenseNumber1 = formData.licenseNumber1 || '';
  const licenseFields = [
    '1 DL/ID Number-1.0',
    '1 DL/ID Number-1.1',
    '1 DL/ID Number-1.2',
    '1 DL/ID Number-1.3',
    '1 DL/ID Number-1.4',
    '1 DL/ID Number-1.5',
    '1 DL/ID Number-1.6',
    '1 DL/ID Number-1.7',
  ];
  for (let i = 0; i < licenseFields.length; i++) {
    const field = form.getTextField(licenseFields[i]);
    field.setText(licenseNumber1[i] || '');
  }

  const fullNameField2 = form.getTextField('1 True Full Name, Last-2');
  const fullName2 = constructFullName(
    formData.lastName2,
    formData.firstName2,
    formData.middleName2,
  );
  fullNameField2.setText(fullName2);

  const licenseNumber2 = formData.licenseNumber2 || '';
  const licenseFields2 = [
    '1 DL/ID Number-2.0',
    '1 DL/ID Number-2.1',
    '1 DL/ID Number-2.2',
    '1 DL/ID Number-2.3',
    '1 DL/ID Number-2.4',
    '1 DL/ID Number-2.5',
    '1 DL/ID Number-2.6',
    '1 DL/ID Number-2.7.0',
  ];
  for (let i = 0; i < licenseFields2.length; i++) {
    const field = form.getTextField(licenseFields2[i]);
    field.setText(licenseNumber2[i] || '');
  }

  const addressFields3 = {
    '1 Residence or Business Address.0': formData.residentualAddress || '',
    '1 Apt/Space Number-1': formData.residentualAptSpace || '',
    '1 City-1': formData.residentualCity || '',
    '1 States1': formData.residentualState || '',
    '1 Zip Code-1': formData.residentualZipCode || '',
  };
  for (const [key, value] of Object.entries(addressFields3)) {
    const field = form.getTextField(key);
    field.setText(value);
  }

  const mailingAddressField1 = form.getTextField('1 Mailing Address');
  mailingAddressField1.setText(formData.mailingAddress || '');

  const mailingFields1 = {
    '1 Apt/Space Number-2': formData.mailingPoBox || '',
    '1 City-2': formData.mailingCity || '',
    '1 States2': formData.mailingState || '',
    '1 Zip Code-2.0': formData.mailingZipCode || '',
  };
  for (const [key, value] of Object.entries(mailingFields1)) {
    const field = form.getTextField(key);
    field.setText(value);
  }

  const printNameLegalOwnerField0 = form.getTextField('3 Print Name Legal Owner.0');
  printNameLegalOwnerField0.setText(fullName1);

  const printNameLegalOwnerField1 = form.getTextField('3 Print Name Legal Owner.1');
  printNameLegalOwnerField1.setText(fullName1);

  const printNameLegalOwnerField2 = form.getTextField('3 Print Name Legal Owner.2.0');
  printNameLegalOwnerField2.setText(fullName2);

  const licensePlateNumberField2 = form.getTextField('License Plate/CF Number122');
  licensePlateNumberField2.setText(formData.vehicleLicensePlateNumber || '');

  const vehicleIdNumberField2 = form.getTextField('Vehicle/Vessel ID/Number211');
  vehicleIdNumberField2.setText(formData.vehicleVinNumber || '');

  const yearMakeField2 = form.getTextField('Year/Make2');
  yearMakeField2.setText(formData.vehicleMake || '');

  const datePurchasedField = form.getTextField('Date Purchased');
  const acquiredYearField = form.getTextField('Acquired Yr');
  const saleDate = `${formData.vehicleSaleMonth}${formData.vehicleSaleDay}`;
  datePurchasedField.setText(saleDate);
  acquiredYearField.setText(formData.vehicleSaleYear);

  const purchasePriceField = form.getTextField('Purchase price');
  purchasePriceField.setText(formData.vehiclePurchasePrice || '');

  const giftBoxField = form.getCheckBox('Gift Box');
  const giftBox1Field = form.getCheckBox('Gift Box1');

  if (formData.gift === true) {
    giftBoxField.check();
    giftBox1Field.uncheck();
  }
  if (formData.trade === true) {
    giftBox1Field.check();
    giftBoxField.uncheck();
  }

  const pdfBytes = await pdfDoc.save();
  const base64Pdf = Buffer.from(pdfBytes).toString('base64');

  return base64Pdf;
}

async function modifyReg256Pdf(fileUrl: string, formData: FormData) {
  const data = formData;

  const existingPdfBytes = await fs.readFile(fileUrl);

  const pdfDoc = await PDFDocument.load(existingPdfBytes, { ignoreEncryption: true });

  const form = pdfDoc.getForm();

  const allFields = form.getFields();


  const pdfBytes = await pdfDoc.save();
  const base64Pdf = Buffer.from(pdfBytes).toString('base64');

  return base64Pdf;
}

async function modifyReg343Pdf(fileUrl: string, formData: FormData) {
  const data = formData;

  const existingPdfBytes = await fs.readFile(fileUrl);

  const pdfDoc = await PDFDocument.load(existingPdfBytes, { ignoreEncryption: true });

  const form = pdfDoc.getForm();

  const allFields = form.getFields();


  const pdfBytes = await pdfDoc.save();
  const base64Pdf = Buffer.from(pdfBytes).toString('base64');

  return base64Pdf;
}

async function modifyReg488cPdf(fileUrl: string, formData: FormData) {
  const data = formData;

  const existingPdfBytes = await fs.readFile(fileUrl);

  const pdfDoc = await PDFDocument.load(existingPdfBytes, { ignoreEncryption: true });

  const form = pdfDoc.getForm();

  const allFields = form.getFields();

  const pdfBytes = await pdfDoc.save();
  const base64Pdf = Buffer.from(pdfBytes).toString('base64');

  return base64Pdf;
}

async function modifyReg4008Pdf(fileUrl: string, formData: FormData) {
  const data = formData;

  const existingPdfBytes = await fs.readFile(fileUrl);

  const pdfDoc = await PDFDocument.load(existingPdfBytes, { ignoreEncryption: true });

  const form = pdfDoc.getForm();

  const allFields = form.getFields();

  const pdfBytes = await pdfDoc.save();
  const base64Pdf = Buffer.from(pdfBytes).toString('base64');

  return base64Pdf;
}

async function modifyReg4017Pdf(fileUrl: string, formData: FormData) {
  const data = formData;

  const existingPdfBytes = await fs.readFile(fileUrl);

  const pdfDoc = await PDFDocument.load(existingPdfBytes, { ignoreEncryption: true });

  const form = pdfDoc.getForm();

  const allFields = form.getFields();

  const pdfBytes = await pdfDoc.save();
  const base64Pdf = Buffer.from(pdfBytes).toString('base64');

  return base64Pdf;
}
