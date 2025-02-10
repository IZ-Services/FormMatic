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
  owner3State?: string;
  owner3FullName?: string;
  owner3LicenseNumber?: string;
  owner2State?: string;
  // mailingAddress?: MailingAddressData;
  lesseeAddress?: LesseeAddressData;
  // trailerLocation?: TrailerLocationData;
  trailerStreet?: string;
  trailerApt?: string;
  trailerCity?: string;
  trailerState?: string;
  trailerZip?: string;
  trailerCountry?: string;
  mailingstreet?: string;
  mailingpo?: string;
  mailingstate?: string;
  mailingzip?: string;
  mailingcity?: string;
  lienHolder?: {
    name: string;
    eltNumber: string;
    address: {
      street: string;
      apt: string;
      city: string;
      state: string;
      zip: string;
    };
    // mailingAddress?: {
    //   street: string;
    //   poBox: string;
    //   city: string;
    //   state: string;
    //   zip: string;
    // };
  };
  
  street: string;
      apt: string;
      city: string;
      state: string;
      zip: string;
  vehicleYear: string;
  vehicleMileage: string;
  notActualMileage: boolean;
  exceedsMechanicalLimit: boolean;
  odometerDiscrepancyExplanation?: string;
}


// interface MailingAddressData {
//   street: string;
//   poBox: string;
//   city: string;
//   state: string;
//   zip: string;
// }

interface LesseeAddressData {
  street: string;
  apt: string;
  city: string;
  state: string;
  zip: string;
}

// interface TrailerLocationData {
//   street: string;
//   apt: string;
//   city: string;
//   state: string;
//   zip: string;
//   country: string;
// }

export async function POST(request: Request) {
  try {
    await connectDB();

    const requestData = await request.json();
    const { transactionId } = requestData;

    if (!transactionId) {
      return NextResponse.json({ error: 'Transaction ID is required.' }, { status: 400 });
    }

    const pdfUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://form-matic2.vercel.app'}/pdfs/Reg227.pdf`;

    const pdfResponse = await fetch(pdfUrl);
    if (!pdfResponse.ok) {
      throw new Error('Failed to fetch the PDF file.');
    }
    const existingPdfBytes = await pdfResponse.arrayBuffer();

    const transaction = await TransactionModel.findById(transactionId);
    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found.' }, { status: 404 });
    }

    const formData = transaction.formData;
    const modifiedPdfBytes = await modifyReg227Pdf(existingPdfBytes, formData);

    return new Response(modifiedPdfBytes, {
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

async function modifyReg227Pdf(fileBytes: ArrayBuffer, formData: any): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
  
  const form = pdfDoc.getForm();
  const fieldNames = form.getFields().map(f => f.getName());
  console.log('Available PDF Fields:', JSON.stringify(fieldNames, null, 2));
  const fieldMapping = {

    trailerStreet: ['County of residence', 'county residence or county where vehicle or vessel is princi.0'],
    trailerCity: 'Trailer City',
    trailerState: 'Trailer State',
    trailerZip: 'Trailer ZIP Code',
    trailerCountry: 'Trailer Country',

    mailingstreet: '1 Mailing Address',
      mailingpo: '1 Apt/Space Number-2',
      mailingcity: '1 City-2',
      mailingstate: '1 States2',
      mailingzip: '1 Zip Code-2.0',
    
    owner1FullName:  [
      '1 True Full Name, Last',
      'true full name of new owner, last, first, middle, suffix, business name, or lessor',
    ],
    owner1LicenseNumber: [
      '1 DL/ID Number-1.0',
      '1 DL/ID Number-1.1',
      '1 DL/ID Number-1.2',
      '1 DL/ID Number-1.3',
      '1 DL/ID Number-1.4',
      '1 DL/ID Number-1.5',
      '1 DL/ID Number-1.6',
      '1 DL/ID Number-1.7',
    ],
    owner1State: 'state.1',
    owner1Phone: [
      'Daytime Telephone_1',
      'Daytime Telephone_2',
      'Daytime Telephone_3'
    ],
    owner1PurchaseDate: [
      '6 Purchase Price/Market Value',
      'Date Purchased',
      'Acquired Yr'
    ],
    owner1PurchaseValue: 'Purchase price',
    
    owner2FullName:[ '1 True Full Name, Last-2', '6 Name First-1'],
    owner2LicenseNumber: [
      '1 DL/ID Number-2.0',
      '1 DL/ID Number-2.1',
      '1 DL/ID Number-2.2',
      '1 DL/ID Number-2.3',
      '1 DL/ID Number-2.4',
      '1 DL/ID Number-2.5',
      '1 DL/ID Number-2.6',
      '1 DL/ID Number-2.7',
    ],
    owner2State: ['state.0','6 state'],


    owner3FullName:'6 Name Last-2',
    owner3LicenseNumber: [
      '1 DL/ID Number-2.0',
      '1 DL/ID Number-2.1',
      '1 DL/ID Number-2.2',
      '1 DL/ID Number-2.3',
      '1 DL/ID Number-2.4',
      '1 DL/ID Number-2.5',
      '1 DL/ID Number-2.6',
      '1 DL/ID Number-2.7',
    ],
    owner3State: 'state-2.8',
    
    isGift: 'Gift Box',
    isTrade: 'Gift Box1',
    
    address: {
      street: [
        '1 Residence or Business Address.0', 
        'Physical residence or business address.0', 
        'physical residence or business address.0'
      ],
      apt: ['1 Apt/Space Number-1','6 Apt/Space Number-1'],
      city: ['1 City-1','6 City-1'],
      state: ['1 States1', '6 States1'],
      zip: ['1 Zip Code-1','6 Zip Code-1']
    },
    
    // mailingAddress: {
    //   street: '1 Mailing Address',
    //   poBox: '1 Apt/Space Number-2',
    //   city: '1 City-2',
    //   state: '1 States2',
    //   zip: '1 Zip Code-2.0',
    // },
    lesseeAddress: {
      street: 'Lessee Street Address',
      apt: 'Lessee Apt',
      city: 'Lessee City',
      state: 'Lessee State',
      zip: 'Lessee ZIP Code'
    },
    // trailerLocation: {
    // //   // street: ['County of residence','county residence or county where vehicle or vessle is princi.0'],
    // //   street: 'County of residence',
    // //   apt: 'Trailer Apt',
    // //   city: 'Trailer City',
    // //   state: 'Trailer State',
    // //   zip: 'Trailer ZIP Code',
    // //   country: 'Trailer Country'

    // // },

    lienHolder: {
      name: ['Name of bank, finance company, or individual having a lien on this vehicle', '7 Name New Legal Owner'],
      eltNumber:  [
       '7 ELT #.0',
       '7 ELT #.1.0',
       '7 ELT #.1.1'
      ],
      address: {
        street: '2 Address',
        apt: '2 Apt/Space Number',
        city: '2 City',
        state: '2 States1',
        zip: '2 Zip Code'
      },
      // mailingAddress: {
      //   street: 'Lien Mailing Street',
      //   poBox: 'Lien Mailing PO Box',
      //   city: 'Lien Mailing City',
      //   state: 'Lien Mailing State',
      //   zip: 'Lien Mailing ZIP'
      // }
    },

    vehicleInformation: {
      licensePlate: ['License Plate/CF Number122','License Plate/CF Number1'],
      vin: ['Vehicle/Vessel ID/Number1', 'Vehicle/Vessel ID/Number211'],
      year: ['Year/Make', 'Year/Make2'],
      make: 'Make',
      mileage: 'Odometer',
      notActualMileage: 'Not Actual Mileage Checkbox',
      exceedsMechanicalLimit: 'Exceeds Mechanical Limit Checkbox',
      odometerExplanation: 'Odometer Explanation'
    },
  };

  const primaryOwner = formData.owners[0];
  const processedData: ProcessedFormData = {
    vehicleYear: formData.vehicleInformation?.year || '',
    vehicleMileage: formData.vehicleInformation?.mileage || '',
    notActualMileage: formData.vehicleInformation?.notActualMileage || false,
    exceedsMechanicalLimit: formData.vehicleInformation?.exceedsMechanicalLimit || false,
    odometerDiscrepancyExplanation: formData.vehicleInformation?.odometerDiscrepancyExplanation || '',
    vehicleLicensePlateNumber: formData.vehicleInformation?.licensePlate || '',
    vehicleVinNumber: formData.vehicleInformation?.hullId || '', 
    vehicleMake: formData.vehicleMake || '',
    owner1FullName: formatOwnerName(primaryOwner),
    owner1LicenseNumber: primaryOwner.licenseNumber || '',
    owner1State: primaryOwner.state || '',
    owner1Phone: primaryOwner.phoneNumber || '',
    owner1PurchaseDate: formatDate(primaryOwner.purchaseDate),
    owner1PurchaseValue: formatCurrency(primaryOwner.purchaseValue),
    isGift: primaryOwner.isGift || false,
    isTrade: primaryOwner.isTrade || false,
    owner2FullName: formData.owners[1] ? formatOwnerName(formData.owners[1]) : '',
    owner2LicenseNumber: formData.owners[1]?.licenseNumber || '',
    owner2State: formData.owners[1]?.state || '',
    owner3FullName: formData.owners[2] ? formatOwnerName(formData.owners[2]) : '',
    owner3LicenseNumber: formData.owners[2]?.licenseNumber || '',
    owner3State: formData.owners[2]?.state || '',
    street: formData.address?.street || '',
    apt: formData.address?.apt || '',
    city: formData.address?.city || '',
    state: formData.address?.state || '',
    zip: formData.address?.zip || '',
    trailerStreet: formData.trailerLocation?.street || '',
    trailerCity: formData.trailerLocation?.city || '',
    trailerState: formData.trailerLocation?.state || '',
    trailerZip: formData.trailerLocation?.zip || '',
    trailerCountry: formData.trailerLocation?.country || '',
    mailingstreet: formData.mailingAddress?.street || '',
    mailingstate: formData.mailingAddress?.state || '',
    mailingcity: formData.mailingAddress?.city || '',
    mailingpo: formData.mailingAddress?.poBox || '',
    mailingzip: formData.mailingAddress?.zip || '',
    

  };


form.updateFieldAppearances();
pdfDoc.catalog.set(PDFName.of('NeedAppearances'), PDFBool.True);

  if (formData.owners.length > 1) {
    const coOwner = formData.owners[1];
    processedData.owner2FullName = formatOwnerName(coOwner);
    processedData.owner2LicenseNumber = coOwner.licenseNumber || '';
    processedData.owner2State = coOwner.state || '';
  }

  // if (formData.mailingAddressDifferent) {
  //   processedData.mailingAddress = {
  //     street: formData.mailingAddress?.street || '',
  //     poBox: formData.mailingAddress?.poBox || '',
  //     city: formData.mailingAddress?.city || '',
  //     state: formData.mailingAddress?.state || '',
  //     zip: formData.mailingAddress?.zip || ''
  //   };
  // }

  // if (formData.lesseeAddressDifferent) {
  //   processedData.lesseeAddress = {
  //     street: formData.lesseeAddress?.street || '',
  //     apt: formData.lesseeAddress?.apt || '',
  //     city: formData.lesseeAddress?.city || '',
  //     state: formData.lesseeAddress?.state || '',
  //     zip: formData.lesseeAddress?.zip || ''
  //   };
  // }

  // if (formData.trailerLocationDifferent) {
  //   processedData.trailerLocation = {
  //     street: formData.trailerLocation?.street || '',
  //     apt: formData.trailerLocation?.apt || '',
  //     city: formData.trailerLocation?.city || '',
  //     state: formData.trailerLocation?.state || '',
  //     zip: formData.trailerLocation?.zip || '',
  //     country: formData.trailerLocation?.country || ''
  //   };
  // }

  if (formData.lienHolder) {
    processedData.lienHolder = {
      name: formData.lienHolder.name || '',
      eltNumber: formData.lienHolder.eltNumber || '',
      address: {
        street: formData.lienHolder.address?.street || '',
        apt: formData.lienHolder.address?.apt || '',
        city: formData.lienHolder.address?.city || '',
        state: formData.lienHolder.address?.state || '',
        zip: formData.lienHolder.address?.zip || ''
      }
    };
  
    // if (formData.lienHolder.mailingAddressDifferent) {
    // //   processedData.lienHolder.mailingAddress = {
    // //     street: formData.lienHolder.mailingAddress?.street || '',
    // //     poBox: formData.lienHolder.mailingAddress?.poBox || '',
    // //     city: formData.lienHolder.mailingAddress?.city || '',
    // //     state: formData.lienHolder.mailingAddress?.state || '',
    // //     zip: formData.lienHolder.mailingAddress?.zip || ''
    // //   };
    // // }
  }



  const safeSetText = (fieldNames: string | string[], value: string) => {
    try {
      if (Array.isArray(fieldNames)) {
        fieldNames.forEach((name) => {
          const field = form.getTextField(name);
          if (field) field.setText(value); 
        });
      } else {
        const field = form.getTextField(fieldNames);
        if (field) field.setText(value);
      }
    } catch (error) {
    }
  };
  
  

  // function splitStringAcrossFields(str: string, numberOfFields: number): string[] {
  //   if (!str) return Array(numberOfFields).fill('');
    
  //   const chunks = [];
  //   const chunkSize = Math.ceil(str.length / numberOfFields);
    
  //   for (let i = 0; i < numberOfFields; i++) {
  //     const start = i * chunkSize;
  //     chunks.push(str.slice(start, start + chunkSize));
  //   }
    
  //   return chunks;
  // }
  

  const safeSetCheckbox = (fieldName: string, value: boolean) => {
    try {
      const checkbox = form.getCheckBox(fieldName);
      value ? checkbox.check() : checkbox.uncheck();
    } catch (error) {
      console.warn(`Checkbox not found: ${fieldName}`);
    }
  };

  const topLevelFields = [
    'vehicleLicensePlateNumber',
    'vehicleVinNumber',
    'vehicleMake',
    'owner1FullName',
    'owner1LicenseNumber',
    'owner1State',
    'owner1Phone',
    'owner1PurchaseDate',
    'owner1PurchaseValue',
    'isGift',
    'isTrade',
    'owner2FullName',
    'owner2LicenseNumber',
    'owner2State',
    'vehicleYear',
    'vehicleMileage',
    'notActualMileage',
    'exceedsMechanicalLimit',
    'odometerDiscrepancyExplanation'
  ];

  for (const formKey of topLevelFields) {
    const pdfField = (fieldMapping as any)[formKey];
    const value = processedData[formKey as keyof ProcessedFormData];
    
    if (!pdfField || value === undefined) continue;

    if (formKey === 'notActualMileage' || formKey === 'exceedsMechanicalLimit') {
      safeSetCheckbox(pdfField, value as boolean);
    } else if (formKey === 'odometerDiscrepancyExplanation') {
      safeSetText(pdfField, value as string);
    } else {
      safeSetText(pdfField, value as string);
    }
  safeSetText(fieldMapping.vehicleInformation.licensePlate, processedData.vehicleLicensePlateNumber);
  safeSetText(fieldMapping.vehicleInformation.vin, processedData.vehicleVinNumber);
  safeSetText(fieldMapping.vehicleInformation.year, processedData.vehicleYear);
  safeSetText(fieldMapping.vehicleInformation.make, processedData.vehicleMake);
  safeSetText(fieldMapping.vehicleInformation.mileage, processedData.vehicleMileage);

  safeSetText(fieldMapping.owner1FullName, processedData.owner1FullName);

  safeSetText(fieldMapping.owner2FullName, processedData.owner2FullName || '');
  safeSetText(fieldMapping.owner2State, processedData.owner2State || '');
  safeSetText(fieldMapping.address.street, processedData.street);
  safeSetText(fieldMapping.address.apt, processedData.apt);
  safeSetText(fieldMapping.address.city, processedData.city);
  safeSetText(fieldMapping.address.zip, processedData.zip);

  safeSetText(fieldMapping.address.state, processedData.state);


  safeSetText(fieldMapping.trailerStreet, processedData.trailerStreet || '');
  safeSetText(fieldMapping.trailerCity, processedData.trailerCity || '');
  safeSetText(fieldMapping.trailerState, processedData.trailerState || '');
  safeSetText(fieldMapping.trailerZip, processedData.trailerZip || '');
  safeSetText(fieldMapping.trailerCountry, processedData.trailerCountry || '');


  if (processedData.mailingstreet) {
    safeSetText(fieldMapping.mailingstreet, processedData.mailingstreet);
  }
  if (processedData.mailingcity) {
    safeSetText(fieldMapping.mailingcity, processedData.mailingcity);
  }
  if (processedData.mailingpo) {
    safeSetText(fieldMapping.mailingpo, processedData.mailingpo);
  }
  if (processedData.mailingstate) {
    safeSetText(fieldMapping.mailingstate, processedData.mailingstate);
  }
  if (processedData.mailingzip) {
    safeSetText(fieldMapping.mailingzip, processedData.mailingzip);
  }
  console.log('Processed Data:', processedData);
  

  safeSetText(fieldMapping.owner3FullName, processedData.owner3FullName || '');
  safeSetText(fieldMapping.owner3LicenseNumber, processedData.owner3LicenseNumber || '');
  safeSetText(fieldMapping.owner3State, processedData.owner3State || '');
    
  if (processedData.odometerDiscrepancyExplanation) {
    safeSetText(fieldMapping.vehicleInformation.odometerExplanation, 
               processedData.odometerDiscrepancyExplanation);
  }

    if (Array.isArray(pdfField)) {
      if (formKey === 'owner1Phone') {
        const phoneParts = formatPhoneNumber(value as string);
        pdfField.forEach((fieldName: string, index: number) => {
          safeSetText(fieldName, phoneParts[index] || '');
        });
      } else if (formKey === 'owner1PurchaseDate') {
        const dateParts = splitDate(value as string);
        safeSetText(pdfField[0], dateParts.month.toString());
        safeSetText(pdfField[1], dateParts.day.toString());
        safeSetText(pdfField[2], dateParts.year.toString().slice(-2));
      } else {
        const valueArray = value.toString().split('');
        pdfField.forEach((fieldName: string, index: number) => {
          safeSetText(fieldName, valueArray[index] || '');
        });
      }
    } else if (typeof value === 'boolean') {
      safeSetCheckbox(pdfField, value);
    } else {
      safeSetText(pdfField, value as string);
    }
    
  }

  const addressTypes = [
    'address', 
    'mailingAddress', 
    'lesseeAddress', 
    'trailerLocation',
    'lienHolder.address',
    'lienHolder.mailingAddress'
  ];
for (const addressType of addressTypes) {
  const [parentKey, childKey] = addressType.split('.');
  
  const parentObject = parentKey 
    ? (processedData as Record<string, any>)[parentKey]
    : processedData;

  if (!parentObject || typeof parentObject !== 'object') continue;

  const addressData = childKey 
    ? (parentObject as Record<string, any>)[childKey]
    : parentObject;

  const pdfMapping = childKey
    ? (fieldMapping as Record<string, any>)[parentKey]?.[childKey]
    : (fieldMapping as Record<string, any>)[addressType];

  if (!addressData || typeof addressData !== 'object') continue;

  for (const [fieldName, pdfField] of Object.entries(pdfMapping as Record<string, any>)) {
    const value = addressData[fieldName];
    if (value === undefined) continue;

    if (Array.isArray(pdfField)) {
      const valueArray = value.toString().split('');
      pdfField.forEach((field: string, index: number) => {
        safeSetText(field, valueArray[index] || '');
      });
    } else {
      safeSetText(pdfField as string, value.toString());
    }
  }
}

  if (processedData.lienHolder) {
    safeSetText(fieldMapping.lienHolder.name, processedData.lienHolder.name);
    safeSetText(fieldMapping.lienHolder.eltNumber, processedData.lienHolder.eltNumber);
  }

  form.updateFieldAppearances();
  pdfDoc.catalog.set(PDFName.of('NeedAppearances'), PDFBool.True);

  return await pdfDoc.save();
}

function formatOwnerName(owner: any): string {
  return [
    owner.lastName?.trim(),
    owner.firstName?.trim(),
    owner.middleName?.trim()
  ].filter(Boolean).join(', ');
}

function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });
}

function formatCurrency(value: string | number): string {
  const numericValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
  return numericValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
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