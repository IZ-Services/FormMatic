import connectDB from '@/lib/mongoDB';
import TransactionModel from '../../../models/transaction';
import { NextResponse } from 'next/server';
import { PDFDocument, PDFName, PDFBool } from 'pdf-lib';
import {  StandardFonts, rgb } from 'pdf-lib';
import Address from '@/components/atoms/Address';
import { HostAddress } from 'mongodb';

export async function POST(request: Request) {
  try {
    await connectDB();

    const requestData = await request.json();
    const { transactionId, formType = 'Reg227' } = requestData;

    if (!transactionId) {
      return NextResponse.json({ error: 'Transaction ID is required.' }, { status: 400 });
    }

    let pdfUrl;
    if (formType === 'DMVREG262') {
      pdfUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://form-matic2.vercel.app'}/pdfs/DMVREG262.pdf`;
    } else {
      pdfUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://form-matic2.vercel.app'}/pdfs/Reg227.pdf`;
    }

    const pdfResponse = await fetch(pdfUrl);
    if (!pdfResponse.ok) {
      throw new Error(`Failed to fetch the PDF file: ${formType}`);
    }
    const existingPdfBytes = await pdfResponse.arrayBuffer();

    const transaction = await TransactionModel.findById(transactionId);
    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found.' }, { status: 404 });
    }

    const formData = transaction.formData;
    
    let modifiedPdfBytes;
    if (formType === 'DMVREG262') {
      modifiedPdfBytes = await modifyDMVREG262Pdf(existingPdfBytes, formData);
    } else {
      modifiedPdfBytes = await modifyReg227Pdf(existingPdfBytes, formData);
    }

    return new Response(modifiedPdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="filled-${formType.toLowerCase()}-form.pdf"`,
      },
    });
  } catch (error) {
    console.error(`[fillPdfForm] Error:`, error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

async function modifyReg227Pdf(fileBytes: ArrayBuffer, formData: any): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
  
  const form = pdfDoc.getForm();
  const fieldNames = form.getFields().map(f => f.getName());
  console.log('Available Reg227 PDF Fields:', JSON.stringify(fieldNames, null, 2));
  
   
  const fieldMapping = {
     
    seller1Name: '1 True Full Name, Last',
    seller2Name: '1 True Full Name, Last-2',
    seller1License: [
      '1 DL/ID Number-1.0',
      '1 DL/ID Number-1.1',
      '1 DL/ID Number-1.2',
      '1 DL/ID Number-1.3',
      '1 DL/ID Number-1.4',
      '1 DL/ID Number-1.5',
      '1 DL/ID Number-1.6',
      '1 DL/ID Number-1.7',
    ],
    seller2License: [
      '1 DL/ID Number-2.0',
      '1 DL/ID Number-2.1',
      '1 DL/ID Number-2.2',
      '1 DL/ID Number-2.3',
      '1 DL/ID Number-2.4',
      '1 DL/ID Number-2.5',
      '1 DL/ID Number-2.6',
      '1 DL/ID Number-2.7.0',
    ],
    seller1State: 'state.1',
    seller2State: 'state.0',
    seller1NamePrint: '3 Print Name Legal Owner.1',
    seller2NamePrint: '3 Print Name Legal Owner.2.0',
    
     
    newOwner1Name: 'true full name of new owner, last, first, middle, suffix, business name, or lessor',
    newOwner2Name: '6 Name First-1',
    newOwner3Name: '6 Name Last-2',
    
    newOwner1License: [
      '6 DL/ID Card Numer-1.0.0',
      "6 DL/ID Card Numer-1.1",
      "6 DL/ID Card Numer-1.2",
      "6 DL/ID Card Numer-1.3",
      "6 DL/ID Card Numer-1.4",
      "6 DL/ID Card Numer-1.5",
      "6 DL/ID Card Numer-1.6",
      "6 DL/ID Card Numer-1.7.0",
    ],
    newOwner2License: [
      '6 DL/ID Card Numer-1.0.1.0',
      '6 DL/ID Card Numer-1.0.1.1',
      '6 DL/ID Card Numer-1.0.1.2',
      '6 DL/ID Card Numer-1.0.1.3',
      '6 DL/ID Card Numer-1.0.1.4',
      '6 DL/ID Card Numer-1.0.1.5',
      '6 DL/ID Card Numer-1.0.1.6',
      "6 DL/ID Card Numer-1.0.1.7",
    ],
    newOwner3License: [
      '6 DL/ID CArd Number-2.0',
      '6 DL/ID CArd Number-2.1',
      '6 DL/ID CArd Number-2.2',
      '6 DL/ID CArd Number-2.3',
      '6 DL/ID CArd Number-2.4',
      '6 DL/ID CArd Number-2.5',
      '6 DL/ID CArd Number-2.6',
      '6 DL/ID CArd Number-2.7',
    ],
    
     
    newOwner1State: '6 DL/ID Card Numer-1.7.1',
    newOwner2State: '6 state',
    newOwner3State: 'state-2.8',
    
     
    owner1Date: 'date.0',
    owner2Date: "4 Date-2",
    
     
    purchaseDateMonth: "6 Purchase Price/Market Value",  
    purchaseDateDay: "Date Purchased",  
    acquiredYearField: "Acquired Yr",  
    
     
    purchasePriceField: "Purchase price",
    
     
    seller1Address: '1 Residence or Business Address.0',
    seller1Apt: '1 Apt/Space Number-1',
    seller1City: '1 City-1',
    seller1StateField: '1 States1',
    seller1Zip: '1 Zip Code-1',
    
     
    newAddress: 'physical residence or business address.0',
    newAddressApt: '6 Apt/Space Number-1',
    newAddressCity: '6 City-1',
    newAddressState: '6 States1',
    newAddressZip: '6 Zip Code-1',
    
     
    mailingAddress: '6 Mailing Address',
    mailingAddressApt: '6 Apt/Space Number-2',
    mailingAddressCity: '6 City-2',
    mailingAddressState: '6 States 2.0',
    mailingAddressZip: '6 Zip Code-2.0',
    
     
    lesseeAddressDescription: 'Lessee address, if different from address above',
    trailerAddressDescription: 'Vessel or trailer coach principally kept at, address or location if different from physical/business address above',
    
     
    lienHolderName: 'Name of bank, finance company, or individual having a lien on this vehicle',
    lienHolderAddress: '2 Address',
    lienHolderApt: '2 Apt/Space Number',
    lienHolderCity: '2 City',
    lienHolderState: '2 States1',
    lienHolderZip: '2 Zip Code',
    
     
    vehicleLicensePlate2: 'License Plate/CF Number122',
    vehicleHullId2: 'Vehicle/Vessel ID/Number211',
    vehicleYear2: 'Year/Make2',
    
     
    vehicleLicensePlate1: 'License Plate/CF Number1',
    vehicleHullId1: 'Vehicle/Vessel ID/Number1',
    vehicleYear1: 'Year/Make',
    
     
    appFor2Checkbox: 'App for2',
    
     
    giftCheckbox: 'Gift Box',
    tradeCheckbox: 'Gift Box1'
  };
  
   
  const safeSetText = (fieldName: string, value: string) => {
    try {
      const field = form.getTextField(fieldName);
      if (field) {
         
        const maxLength = field.getMaxLength();
        
         
        const finalValue = maxLength !== undefined && maxLength > 0 && value.length > maxLength 
          ? value.substring(0, maxLength) 
          : value;
        
        field.setText(finalValue);
        console.log(`Successfully filled field: ${fieldName}`);
      } else {
        console.warn(`Field not found: ${fieldName}`);
      }
    } catch (error) {
      console.error(`Error filling field ${fieldName}:`, error);
    }
  };
  
   
  const safeSetCheckbox = (fieldName: string, value: boolean) => {
    try {
      const checkbox = form.getCheckBox(fieldName);
      if (checkbox) {
        value ? checkbox.check() : checkbox.uncheck();
        console.log(`Successfully ${value ? 'checked' : 'unchecked'} checkbox: ${fieldName}`);
      } else {
        console.warn(`Checkbox not found: ${fieldName}`);
      }
    } catch (error) {
      console.error(`Error setting checkbox ${fieldName}:`, error);
    }
  };
  
   
  const fillCharacterFields = (fieldNames: string[], value: string) => {
    const chars = value.split('');
    fieldNames.forEach((fieldName, index) => {
      if (index < chars.length) {
        safeSetText(fieldName, chars[index]);
      } else {
        safeSetText(fieldName, '');  
      }
    });
  };
  
   
  const formatAddress = (address: any) => {
    if (!address) return '';
    
    const parts = [
      address.street,
      address.apt ? `Apt/Space ${address.apt}` : '',
      address.city,
      address.state,
      address.zip
    ].filter(Boolean);
    
    return parts.join(', ');
  };
  
   
   
  const sellerInfo = formData.sellerInfo || {};
  const seller1 = sellerInfo.sellers?.[0] || {};
  const seller2 = sellerInfo.sellers?.[1] || {};
  
   
  const owners = formData.owners || [];
  const owner1 = owners[0] || {};
  const owner2 = owners[1] || {};
  const owner3 = owners[2] || {};
  
   
  const addressData = formData.address || {};
  const mailingAddressData = formData.mailingAddress || {};
  const lesseeAddressData = formData.lesseeAddress || {};
  const trailerLocationData = formData.trailerLocation || {};
  const mailingAddressDifferent = formData.mailingAddressDifferent || false;
  const lesseeAddressDifferent = formData.lesseeAddressDifferent || false;
  const trailerLocationDifferent = formData.trailerLocationDifferent || false;
  
   
  const sellerAddress = formData.sellerAddress || seller1.address || {};
  
   
  const lienHolder = formData.lienHolder || {};
  const lienHolderAddress = lienHolder.address || {};
  
   
  const vehicleInfo = formData.vehicleInformation || {};
  
   
  const formatSellerName = (seller: any) => {
    return [
      seller.lastName?.trim() || '',
      seller.middleName?.trim() || '',
      seller.firstName?.trim() || ''
    ].filter(Boolean).join(', ');
  };
  
   
  const formatOwnerNamePrint = (owner: any) => {
    return [
      owner.firstName?.trim() || '',
      owner.middleName?.trim() || '',
      owner.lastName?.trim() || ''
    ].filter(Boolean).join(' ');
  };
  
   
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
     
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      return dateString;
    }
    
     
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;  
      }
      
       
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
      
      return `${month}/${day}/${year}`;
    } catch (e) {
      return dateString;  
    }
  };
  
   
  const extractDateComponents = (dateString: string) => {
    if (!dateString) return { month: '', day: '', year: '' };
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return { month: '', day: '', year: '' };
      }
      
      return {
        month: String(date.getMonth() + 1).padStart(2, '0'),
        day: String(date.getDate()).padStart(2, '0'),
        year: date.getFullYear().toString()
      };
    } catch (e) {
      return { month: '', day: '', year: '' };
    }
  };
  
   
  if (Object.keys(seller1).length > 0) {
    safeSetText(fieldMapping.seller1Name, formatSellerName(seller1));
    safeSetText(fieldMapping.seller1NamePrint, formatOwnerNamePrint(seller1));
    safeSetText(fieldMapping.seller1State, seller1.state || '');
    
     
    if (seller1.licenseNumber) {
      fillCharacterFields(fieldMapping.seller1License, seller1.licenseNumber);
    }
    
     
    if (seller1.isGift) {
      safeSetCheckbox(fieldMapping.giftCheckbox, true);
    }
    if (seller1.isTrade) {
      safeSetCheckbox(fieldMapping.tradeCheckbox, true);
    }
  }
  
  if (Object.keys(seller2).length > 0) {
    safeSetText(fieldMapping.seller2Name, formatSellerName(seller2));
    safeSetText(fieldMapping.seller2NamePrint, formatOwnerNamePrint(seller2));
    safeSetText(fieldMapping.seller2State, seller2.state || '');
    
     
    if (seller2.licenseNumber) {
      fillCharacterFields(fieldMapping.seller2License, seller2.licenseNumber);
    }
  }
  
   
   
  if (Object.keys(owner1).length > 0) {
    safeSetText(fieldMapping.newOwner1Name, formatOwnerNamePrint(owner1));
    
     
    safeSetText(fieldMapping.newOwner1State, owner1.state || '');
    
     
    if (owner1.licenseNumber) {
      fillCharacterFields(fieldMapping.newOwner1License, owner1.licenseNumber);
    }
    
     
    if (!seller1.isGift && owner1.isGift) {
      safeSetCheckbox(fieldMapping.giftCheckbox, true);
    }
    if (!seller1.isTrade && owner1.isTrade) {
      safeSetCheckbox(fieldMapping.tradeCheckbox, true);
    }
  }
  
   
  if (Object.keys(owner2).length > 0) {
    safeSetText(fieldMapping.newOwner2Name, formatOwnerNamePrint(owner2));
    safeSetText(fieldMapping.newOwner2State, owner2.state || '');
    
     
    if (owner2.licenseNumber) {
      fillCharacterFields(fieldMapping.newOwner2License, owner2.licenseNumber);
    }
  }
  
   
  if (Object.keys(owner3).length > 0) {
    safeSetText(fieldMapping.newOwner3Name, formatOwnerNamePrint(owner3));
    safeSetText(fieldMapping.newOwner3State, owner3.state || '');
    
     
    if (owner3.licenseNumber) {
      fillCharacterFields(fieldMapping.newOwner3License, owner3.licenseNumber);
    }
  }
  
   
  
   
  safeSetText(fieldMapping.seller1Address, sellerAddress.street || '');
  safeSetText(fieldMapping.seller1Apt, sellerAddress.apt || '');
  safeSetText(fieldMapping.seller1City, sellerAddress.city || '');
  safeSetText(fieldMapping.seller1StateField, sellerAddress.state || '');
  safeSetText(fieldMapping.seller1Zip, sellerAddress.zip || '');
  
   
  safeSetText(fieldMapping.newAddress, addressData.street || '');
  safeSetText(fieldMapping.newAddressApt, addressData.apt || '');
  safeSetText(fieldMapping.newAddressCity, addressData.city || '');
  safeSetText(fieldMapping.newAddressState, addressData.state || '');
  safeSetText(fieldMapping.newAddressZip, addressData.zip || '');
  
   
  if (mailingAddressDifferent) {
    safeSetText(fieldMapping.mailingAddress, mailingAddressData.street || '');
    safeSetText(fieldMapping.mailingAddressApt, mailingAddressData.poBox || '');
    safeSetText(fieldMapping.mailingAddressCity, mailingAddressData.city || '');
    safeSetText(fieldMapping.mailingAddressState, mailingAddressData.state || '');
    safeSetText(fieldMapping.mailingAddressZip, mailingAddressData.zip || '');
  }
  
   
  if (lesseeAddressDifferent) {
    const lesseeAddressFormatted = formatAddress(lesseeAddressData);
    safeSetText(fieldMapping.lesseeAddressDescription, lesseeAddressFormatted);
  }
  
   
  if (trailerLocationDifferent) {
    let trailerLocationFormatted = formatAddress(trailerLocationData);
    
     
    if (trailerLocationData.country) {
      trailerLocationFormatted += trailerLocationFormatted ? `, ${trailerLocationData.country}` : trailerLocationData.country;
    }
    
    safeSetText(fieldMapping.trailerAddressDescription, trailerLocationFormatted);
  }
  
   
  const purchaseDate = owner1.purchaseDate || seller1.saleDate || '';
  const formattedDate = formatDate(purchaseDate);
  
   
  const dateComponents = extractDateComponents(purchaseDate);
  
   
  if (purchaseDate) {
     
    safeSetText(fieldMapping.owner1Date, formattedDate);
    
     
    safeSetText(fieldMapping.purchaseDateMonth, dateComponents.month); 
    safeSetText(fieldMapping.purchaseDateDay, dateComponents.day);
    safeSetText(fieldMapping.acquiredYearField, dateComponents.year);
  }
  
   
  const purchaseValue = owner1.purchaseValue || '';
  
   
  if (purchaseValue) {
    safeSetText(fieldMapping.purchasePriceField, purchaseValue);
  }
  
   
  const owner2Date = owner2.purchaseDate || seller2.saleDate || '';
  if (owner2Date) {
    safeSetText(fieldMapping.owner2Date, formatDate(owner2Date));
  }
  
   
  safeSetText(fieldMapping.lienHolderName, lienHolder.name || 'NONE');
  safeSetText(fieldMapping.lienHolderAddress, lienHolderAddress.street || 'NONE');
  safeSetText(fieldMapping.lienHolderApt, lienHolderAddress.apt || '');
  safeSetText(fieldMapping.lienHolderCity, lienHolderAddress.city || 'NONE');
  safeSetText(fieldMapping.lienHolderState, lienHolderAddress.state || 'NONE');
  safeSetText(fieldMapping.lienHolderZip, lienHolderAddress.zip || 'NONE');
  
   
  let yearMakeValue = '';
  if (vehicleInfo.year && vehicleInfo.make) {
    yearMakeValue = `${vehicleInfo.year} ${vehicleInfo.make}`;
  } else if (vehicleInfo.year) {
    yearMakeValue = vehicleInfo.year;
  } else if (vehicleInfo.make) {
    yearMakeValue = vehicleInfo.make;
  }
  
   
   
  safeSetText(fieldMapping.vehicleLicensePlate1, vehicleInfo.licensePlate || '');
  safeSetText(fieldMapping.vehicleHullId1, vehicleInfo.hullId || '');
  safeSetText(fieldMapping.vehicleYear1, yearMakeValue);
  
   
  safeSetText(fieldMapping.vehicleLicensePlate2, vehicleInfo.licensePlate || '');
  safeSetText(fieldMapping.vehicleHullId2, vehicleInfo.hullId || '');
  safeSetText(fieldMapping.vehicleYear2, yearMakeValue);
  
   
  safeSetCheckbox(fieldMapping.appFor2Checkbox, true);
  
   
  form.updateFieldAppearances();
  pdfDoc.catalog.set(PDFName.of('NeedAppearances'), PDFBool.True);
  
  return await pdfDoc.save();
}



async function modifyDMVREG262Pdf(fileBytes: ArrayBuffer, formData: any): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(fileBytes);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const form = pdfDoc.getForm();
  try {
    const purchaseField = form.getTextField('Text7');
    if (purchaseField) {
      const purchaseValue = formData.owners?.purchaseValue || '';
      purchaseField.setText(purchaseValue.toString());
      console.log('Successfully set purchase value in Text7 field');
    } else {
      console.warn('Text7 field not found, falling back to drawing method');
      
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      
      firstPage.drawText(formData.owners?.purchaseValue || '', {
        x: 825, 
        y: 595, 
        size: 10,
        font: font,
        color: rgb(0, 0, 0),
      });
    }
  } catch (error) {
    console.error('Error setting purchase value:', error);
  }


  
  
  console.log("Attempting to draw text directly on the PDF...");
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  const textPositions = {
    'IDENTIFICATION NUMBER': { x: 100, y: 665 },
    'YEAR MODEL': { x: 245, y: 665 },
    'MAKE': { x: 300, y: 665 },
    'LICENSE PLATE/CF NO': { x: 385, y: 665 },
    'MOTORCYCLE ENGINE NUMBER': { x: 515, y: 665 },
    'I/We': { x: 85, y: 625 },
    'to': { x: 85, y: 599 },
    'SELLING PRICE': { x: 515, y: 600 },
    'GIFT RELATIONSHIP': { x: 250, y: 565 }, 
    'GIFT VALUE': { x: 520, y: 565 }, 
    'BUYER 1': { x: 80, y: 345 },
    'BUYER 2': { x: 80, y: 320 },
    'BUYER 3': { x: 80, y: 300 },
    'SELLER 1': { x: 80, y: 216 },
    'SELLER 2': { x: 80, y: 192 },
    'SELLER 3': { x: 80, y: 168 },
    'BUYER 1 DOP': { x: 425, y: 345 },
    'BUYER 2 DOP': { x: 425, y: 320 },
    'BUYER 3 DOP': { x: 425, y: 300 },
    'SELLER 1 DOP': { x: 425, y: 216 },
    'SELLER 2 DOP': { x: 425, y: 192 },
    'SELLER 3 DOP': { x: 425, y: 168 },
    'BUYER 1 LICENSE': { x: 490, y: 345 },
    'BUYER 2 LICENSE': { x: 490, y: 320 },
    'BUYER 3 LICENSE': { x: 495, y: 300 },
    'SELLER 1 LICENSE': { x: 490, y: 216 },
    'SELLER 2 LICENSE': { x: 495, y: 192 },
    'SELLER 3 LICENSE': { x: 495, y: 168 },
    'BUYER 1 ADDRESS': { x: 45, y: 274 },
    'SELLER 1 ADDRESS': { x: 45, y: 140 },
    'BUYER 1 PHONE': { x: 495, y: 275 },
    'SELLER 1 PHONE': { x: 495, y: 140 },
    'NOT ACTUAL MILEAGE': { x: 60, y: 530 },
    'EXCEEDS MECHANICAL LIMITS': { x: 490, y: 530 },
  };

   

  const formatFullName = (person: any) => {
    if (!person) return '';
    return [person.firstName, person.middleName, person.lastName].filter(Boolean).join(' ');
  };
  
  const formatAddress = (address: any) => {
    if (!address) return '';
    
    if (address.street !== undefined || address.city !== undefined || address.state !== undefined || address.zip !== undefined) {
      const parts = [
        address.street || '',
        address.apt ? `Apt/Space ${address.apt}` : '',
        address.poBox ? `PO Box ${address.poBox}` : '',
        address.city ? `${address.city},` : '',
        address.state || '',
        address.zip || ''
      ].filter(Boolean);
      return parts.join(' ');
    }
    
    const parts = [
      address.street,
      address.apt ? `Apt/Space ${address.apt}` : ''
    ].filter(Boolean);
    return parts.join(', ');
  };
  
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateStr; 
    }
  };
  
  const vehicleInfo = formData.vehicleInformation || {};
  const sellerInfo = formData.sellerInfo || {};
  const sellers = sellerInfo.sellers || [];
  const owners = formData.owners || [];
  
  const buyerMailingAddressDifferent = formData.residentialAddress?.mailingAddressDifferent || false;

  
  const buyerRegularAddress = formData.residentialAddress?.address || {};
  const buyerMailingAddress = buyerMailingAddressDifferent ? 
                            (formData.residentialAddress?.mailingAddress || {}) : 
                            buyerRegularAddress;

  
                            const sellerResidentialAddress = formData.residentialAddress || null;

const sellerMailingAddressDifferent = 
  (sellerResidentialAddress && sellerResidentialAddress.mailingAddressDifferent) || 
  (!sellerResidentialAddress && formData.residentialAddress?.mailingAddressDifferent) || 
  false;

const sellerRegularAddress = 
  (sellerResidentialAddress && sellerResidentialAddress.address) || 
  (!sellerResidentialAddress && formData.residentialAddress?.address) || 
  {};

const sellerMailingAddress = 
  sellerMailingAddressDifferent ? 
    ((sellerResidentialAddress && sellerResidentialAddress.mailingAddress) || 
     (!sellerResidentialAddress && formData.residentialAddress?.mailingAddress) || 
     {}) : 
    sellerRegularAddress;

    try {
      const mileage = vehicleInfo.mileage || '';
      if (mileage) {
        // Convert mileage to string and pad with leading zeros if needed to ensure 6 digits
        const mileageString = mileage.toString().padStart(6, '0');
        
        // Distribute mileage digits across Text9-Text14 fields
        for (let i = 0; i < 6; i++) {
          const textFieldName = `Text${9 + i}`;
          const textField = form.getTextField(textFieldName);
          
          if (textField) {
            // Get the digit at position i (or empty if not enough digits)
            const digit = i < mileageString.length ? mileageString[i] : '';
            textField.setText(digit);
            console.log(`Successfully set ${textFieldName} to ${digit}`);
          } else {
            console.warn(`${textFieldName} field not found, falling back to drawing method`);
            
            // If field not found, draw directly on PDF
            // Calculate position for each digit (adjust these coordinates as needed)
            const xPositions = [200, 220, 240, 260, 280, 300]; // Example positions
            const y = 500; // Example y position
            
            if (i < mileageString.length) {
              firstPage.drawText(mileageString[i], {
                x: xPositions[i],
                y: y,
                size: 10,
                font: font,
                color: rgb(0, 0, 0),
              });
            }
          }
        }
      }
    } catch (error) {
      console.error('Error setting mileage values:', error);
    }
  for (const [label, position] of Object.entries(textPositions)) {
    let value = '';
    
    if (label === 'IDENTIFICATION NUMBER') value = vehicleInfo.hullId || '';
    else if (label === 'YEAR MODEL') value = vehicleInfo.year || '';
    else if (label === 'MAKE') value = vehicleInfo.make || '';
    else if (label === 'LICENSE PLATE/CF NO') value = vehicleInfo.licensePlate || '';
    else if (label === 'MOTORCYCLE ENGINE NUMBER') value = vehicleInfo.engineNumber || '';
    else if (label === 'NOT ACTUAL MILEAGE') value = vehicleInfo.notanotActualMileage || '';
    else if (label === 'EXCEEDS MECHANICAL LIMITS') value = vehicleInfo.engineNumber || '';

    else if (label === 'I/We') value = formatFullName(sellers[0]) || '';
    else if (label === 'to') value = formatFullName(owners[0]) || '';
    else if (label === 'SELLING PRICE') {
      if (Array.isArray(owners) && owners.length > 0 && owners[0].purchaseValue) {
        value = owners[0].purchaseValue.toString();
      } else if (formData.purchaseValue) {
        value = formData.purchaseValue.toString();
      } else if (typeof owners.purchaseValue !== 'undefined') {
        value = owners.purchaseValue.toString();
      } else {
        console.log("Owner data structure:", JSON.stringify(owners));
        value = "";
      }    
    }
    else if (label === 'GIFT RELATIONSHIP') {
      if (Array.isArray(owners) && owners.length > 0) {
        value = owners[0].relationshipWithGifter || '';
        console.log(`Found gift relationship: ${value}`);
      }
    }
    else if (label === 'GIFT VALUE') {
      if (Array.isArray(owners) && owners.length > 0) {
        value = owners[0].giftValue || '';
        console.log(`Found gift value: ${value}`);
      }
    }
    else if (label === 'BUYER 1') {
      if (Array.isArray(owners) && owners.length > 0) {
        value = formatFullName(owners[0]) || '';
        console.log(`Found buyer 1 value: ${value}`);
      }
    }
    else if (label === 'BUYER 2') {
      if (Array.isArray(owners) && owners.length > 1) {
        value = formatFullName(owners[1]) || '';
        console.log(`Found buyer 2 value: ${value}`);
      }
    }
    else if (label === 'BUYER 3') {
      if (Array.isArray(owners) && owners.length > 2) {
        value = formatFullName(owners[2]) || '';
        console.log(`Found buyer 3 value: ${value}`);
      }
    }
   
    else if (label === 'SELLER 1') {
      if (Array.isArray(sellers) && sellers.length > 0) {
        value = formatFullName(sellers[0]) || '';
        console.log(`Found seller 1 value: ${value}`);
      }
    }
    else if (label === 'SELLER 2') {
      if (Array.isArray(sellers) && sellers.length > 1) {
        value = formatFullName(sellers[1]) || '';
        console.log(`Found seller 2 value: ${value}`);
      }
    }
    else if (label === 'SELLER 3') {
      if (Array.isArray(sellers) && sellers.length > 2) {
        value = formatFullName(sellers[2]) || '';
        console.log(`Found seller 3 value: ${value}`);
      }
    }
    
    else if (label === 'BUYER 1 DOP') {
      if (Array.isArray(owners) && owners.length > 0) {
        value = formatDate(owners[0].purchaseDate || '');
        console.log(`Found buyer 1 DOP: ${value}`);
      }
    }
    else if (label === 'BUYER 2 DOP') {
      if (Array.isArray(owners) && owners.length > 1) {
        value = formatDate(owners[1].purchaseDate || '');
        console.log(`Found buyer 2 DOP: ${value}`);
      }
    }
    else if (label === 'BUYER 3 DOP') {
      if (Array.isArray(owners) && owners.length > 2) {
        value = formatDate(owners[2].purchaseDate || '');
        console.log(`Found buyer 3 DOP: ${value}`);
      }
    }
    else if (label === 'SELLER 1 DOP') {
      if (Array.isArray(sellers) && sellers.length > 0) {
        value = formatDate(sellers[0].saleDate || sellers[0].purchaseDate || '');
        console.log(`Found seller 1 DOP: ${value}`);
      }
    }
    else if (label === 'SELLER 2 DOP') {
      if (Array.isArray(sellers) && sellers.length > 1) {
        value = formatDate(sellers[1].saleDate || sellers[1].purchaseDate || '');
        console.log(`Found seller 2 DOP: ${value}`);
      }
    }
    else if (label === 'SELLER 3 DOP') {
      if (Array.isArray(sellers) && sellers.length > 2) {
        value = formatDate(sellers[2].saleDate || sellers[2].purchaseDate || '');
        console.log(`Found seller 3 DOP: ${value}`);
      }
    }
    
    else if (label === 'BUYER 1 LICENSE') {
      if (Array.isArray(owners) && owners.length > 0) {
        value = owners[0].licenseNumber || '';
        console.log(`Found buyer 1 license: ${value}`);
      }
    }
    else if (label === 'BUYER 2 LICENSE') {
      if (Array.isArray(owners) && owners.length > 1) {
        value = owners[1].licenseNumber || '';
        console.log(`Found buyer 2 license: ${value}`);
      }
    }
    else if (label === 'BUYER 3 LICENSE') {
      if (Array.isArray(owners) && owners.length > 2) {
        value = owners[2].licenseNumber || '';
        console.log(`Found buyer 3 license: ${value}`);
      }
    }
    
    else if (label === 'SELLER 1 LICENSE') {
      if (Array.isArray(sellers) && sellers.length > 0) {
        value = sellers[0].licenseNumber || '';
        console.log(`Found seller 1 license: ${value}`);
      }
    }
    else if (label === 'SELLER 2 LICENSE') {
      if (Array.isArray(sellers) && sellers.length > 1) {
        value = sellers[1].licenseNumber || '';
        console.log(`Found seller 2 license: ${value}`);
      }
    }
    else if (label === 'SELLER 3 LICENSE') {
      if (Array.isArray(sellers) && sellers.length > 2) {
        value = sellers[2].licenseNumber || '';
        console.log(`Found seller 3 license: ${value}`);
      }
    }
    
    else if (label === 'BUYER 1 ADDRESS') {
      if (buyerMailingAddressDifferent) {
        value = formatAddress(buyerMailingAddress);
        console.log(`Found buyer 1 mailing address (different): ${value}`);
      } else {
        console.log("Buyer mailing address is not different, skipping");
      }
    }
    
    else if (label === 'SELLER 1 ADDRESS') {
      if (sellerMailingAddressDifferent) {
        value = formatAddress(sellerMailingAddress);
        console.log(`Found seller 1 mailing address (different): ${value}`);
      } else {
        console.log("Seller mailing address is not different, skipping");
      }
    }
    
    else if (label === 'BUYER 1 PHONE') {
      if (Array.isArray(owners) && owners.length > 0) {
        const phoneCode = owners[0].phoneCode || '';
        const phoneNumber = owners[0].phoneNumber || '';
        if (phoneCode && phoneNumber) {
          value = `${phoneCode} ${phoneNumber}`;
        } else {
          value = phoneNumber;
        }
        console.log(`Found buyer 1 phone: ${value}`);
      }
    }
    
    else if (label === 'SELLER 1 PHONE') {
      if (Array.isArray(sellers) && sellers.length > 0) {
        const phoneCode = sellers[0].phoneCode || '';
        const phoneNumber = sellers[0].phoneNumber || sellers[0].phone || '';
        if (phoneCode && phoneNumber) {
          value = `${phoneCode} ${phoneNumber}`;
        } else {
          value = phoneNumber;
        }
        console.log(`Found seller 1 phone: ${value}`);
      }
    }
    
    if (value) {
      console.log(`Drawing text for ${label} at (${position.x}, ${position.y}): "${value}"`);
      
      firstPage.drawText(value, {
        x: position.x,
        y: position.y,
        size: 10,
        font: font,
        color: rgb(0, 0, 0),
      });
    }
  }
  
  if (vehicleInfo.odometerNotActual) {
    firstPage.drawText('X', {
      x: 60, y: 530,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    });
  }
  
  if (vehicleInfo.odometerExceeds) {
    firstPage.drawText('X', {
      x: 490, y: 530,  
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    });
  }
  
  return await pdfDoc.save();
}