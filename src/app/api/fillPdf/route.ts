import connectDB from '@/lib/mongoDB';
import TransactionModel from '../../../models/transaction';
import { NextResponse } from 'next/server';
import { PDFDocument, PDFName, PDFBool } from 'pdf-lib';
import {  StandardFonts, rgb } from 'pdf-lib';


export async function POST(request: Request) {
  try {
    await connectDB();

    const requestData = await request.json();
    const { transactionId, formType = 'Reg227', transactionType } = requestData;

    if (!transactionId) {
      return NextResponse.json({ error: 'Transaction ID is required.' }, { status: 400 });
    }

    const transaction = await TransactionModel.findById(transactionId);
    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found.' }, { status: 404 });
    }

    const effectiveTransactionType = transactionType || transaction.transactionType;

    console.log('Transaction data:', JSON.stringify({
      id: transaction._id,
      type: effectiveTransactionType,
      isMultiple: transaction.isPartOfMultipleTransfer,
      index: transaction.transferIndex,
      total: transaction.totalTransfers
    }));

    let formData = transaction.formData;

    const isMultipleTransfer = transaction.isPartOfMultipleTransfer === true || 
                            effectiveTransactionType?.includes('Multiple Transfer') ||
                            (formData && formData.newOwners && formData.newOwners.owners);

    console.log('Complete formData:', JSON.stringify(formData));

    if (isMultipleTransfer) {
      console.log('Multiple transfer structure detected, restructuring data...');
      try {
        const restructuredData = {
          owners: [],
          vehicleInformation: {},
          sellerInfo: { sellers: [] },
          sellerAddress: {},
          sellerMailingAddress: {},
          sellerMailingAddressDifferent: false,
          legalOwnerInformation: {},
          address: {},
          vehicleTransactionDetails: {},
          lienHolder: {},
          mailingAddress: {},
          lesseeAddress: {},
          trailerLocation: {},
          powerOfAttorney: {},
          mailingAddressDifferent: false,
          lesseeAddressDifferent: false,
          trailerLocationDifferent: false,
          itemRequested: {},
          disabledPersonParkingInfo: {},
          addressChangeInfo: {},
          pnoDetails: {}
        };
        
        formData = restructuredData;
      } catch (error) {
        console.error('Error restructuring data:', error);
        formData = {
          owners: [],
          vehicleInformation: {},
          sellerInfo: { sellers: [] },
          sellerAddress: {},
          sellerMailingAddress: {},
          sellerMailingAddressDifferent: false,
          legalOwnerInformation: {},
          address: {},
          vehicleTransactionDetails: {},
          lienHolder: {},
          mailingAddress: {},
          lesseeAddress: {},
          trailerLocation: {},
          powerOfAttorney: {},
          mailingAddressDifferent: false,
          lesseeAddressDifferent: false,
          trailerLocationDifferent: false,
          itemRequested: {},
          disabledPersonParkingInfo: {},
          addressChangeInfo: {},
          pnoDetails: {}
        };
      }
    }

    formData.owners = formData.owners || [];
    formData.vehicleInformation = formData.vehicleInformation || {};
    formData.sellerInfo = formData.sellerInfo || { sellers: [] };
    formData.legalOwnerInformation = formData.legalOwnerInformation || {};
    formData.sellerAddress = formData.sellerAddress || {};
    formData.sellerMailingAddress = formData.sellerMailingAddress || {};
    formData.itemRequested = formData.itemRequested || {};
    formData.vehicleTransactionDetails = formData.vehicleTransactionDetails || {};
    formData.disabledPersonParkingInfo = formData.disabledPersonParkingInfo || {};
    formData.addressChangeInfo = formData.addressChangeInfo || {};
    formData.pnoDetails = formData.pnoDetails || {};
    
    formData.mailingAddressDifferent = !!formData.mailingAddressDifferent;
    formData.lesseeAddressDifferent = !!formData.lesseeAddressDifferent;
    formData.trailerLocationDifferent = !!formData.trailerLocationDifferent;
    formData.sellerMailingAddressDifferent = !!formData.sellerMailingAddressDifferent;

    console.log("After restructuring:");

    let pdfPath;
    let pdfUrl;
    
    if (process.env.NODE_ENV === 'development') {
      const fs = require('fs');
      const path = require('path');
      
      if (formType === 'DMVREG262') {
        pdfPath = path.join(process.cwd(), 'public', 'pdfs', 'DMVREG262.pdf');
      } else if (formType === 'Reg101') {
        pdfPath = path.join(process.cwd(), 'public', 'pdfs', 'Reg101.pdf');
      } else if (formType === 'Reg256') { 
        pdfPath = path.join(process.cwd(), 'public', 'pdfs', 'Reg256.pdf');
      } else if (formType === 'Reg156') { 
        pdfPath = path.join(process.cwd(), 'public', 'pdfs', 'Reg156.pdf');
      } else if (formType === 'DMVReg166') {
        pdfPath = path.join(process.cwd(), 'public', 'pdfs', 'DMVReg166.pdf');
      } else if (formType === 'REG195') {
        pdfPath = path.join(process.cwd(), 'public', 'pdfs', 'REG195.pdf');
      } else if (formType === 'DMV14') {
        pdfPath = path.join(process.cwd(), 'public', 'pdfs', 'DMV14.pdf');
      } else if (formType === 'REG17') {
        pdfPath = path.join(process.cwd(), 'public', 'pdfs', 'REG17.pdf');
      } else if (formType === 'REG102') {
        pdfPath = path.join(process.cwd(), 'public', 'pdfs', 'REG102.pdf');
      } else if (formType === 'Reg343') {
        pdfPath = path.join(process.cwd(), 'public', 'pdfs', 'Reg343.pdf');
      } else {
        pdfPath = path.join(process.cwd(), 'public', 'pdfs', 'Reg227.pdf');
      }
      
      const fileBuffer = fs.readFileSync(pdfPath);
      const existingPdfBytes = fileBuffer.buffer.slice(
        fileBuffer.byteOffset,
        fileBuffer.byteOffset + fileBuffer.byteLength
      );
      
      let modifiedPdfBytes;
      if (formType === 'DMVREG262') {
        modifiedPdfBytes = await modifyDMVREG262Pdf(existingPdfBytes, formData);
      } else if (formType === 'Reg101') {
        modifiedPdfBytes = await modifyReg101Pdf(existingPdfBytes, formData);
      } else if (formType === 'Reg256') { 
        modifiedPdfBytes = await modifyReg256Pdf(existingPdfBytes, formData);
      } else if (formType === 'Reg156') { 
        modifiedPdfBytes = await modifyReg156Pdf(existingPdfBytes, formData);
      } else if (formType === 'DMVReg166') {
        modifiedPdfBytes = await modifyDMVReg166Pdf(existingPdfBytes, formData);
      } else if (formType === 'REG195') {
        modifiedPdfBytes = await modifyREG195Pdf(existingPdfBytes, formData);
      } else if (formType === 'DMV14') {
        modifiedPdfBytes = await modifyDMV14Pdf(existingPdfBytes, formData);
      } else if (formType === 'REG17') {
        modifiedPdfBytes = await modifyREG17Pdf(existingPdfBytes, formData, effectiveTransactionType);
      } else if (formType === 'REG102') {
        modifiedPdfBytes = await modifyREG102Pdf(existingPdfBytes, formData, effectiveTransactionType);
      } else if (formType === 'Reg343') {
        modifiedPdfBytes = await modifyReg343Pdf(existingPdfBytes, formData, effectiveTransactionType);
      } else {
        modifiedPdfBytes = await modifyReg227Pdf(existingPdfBytes, formData, effectiveTransactionType);
      }

      return new Response(modifiedPdfBytes, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="filled-${formType.toLowerCase()}-form.pdf"`,
        },
      });
    } else {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://form-matic2.vercel.app';
      
      if (formType === 'DMVREG262') {
        pdfUrl = `${baseUrl}/pdfs/DMVREG262.pdf`;
      } else if (formType === 'Reg101') {
        pdfUrl = `${baseUrl}/pdfs/Reg101.pdf`;
      } else if (formType === 'Reg256') {
        pdfUrl = `${baseUrl}/pdfs/Reg256.pdf`;
      } else if (formType === 'Reg156') {
        pdfUrl = `${baseUrl}/pdfs/Reg156.pdf`;
      } else if (formType === 'DMVReg166') {
        pdfUrl = `${baseUrl}/pdfs/DMVReg166.pdf`;
      } else if (formType === 'REG195') {
        pdfUrl = `${baseUrl}/pdfs/REG195.pdf`;
      } else if (formType === 'DMV14') {
        pdfUrl = `${baseUrl}/pdfs/DMV14.pdf`;
      } else if (formType === 'REG17') {
        pdfUrl = `${baseUrl}/pdfs/REG17.pdf`;
      } else if (formType === 'REG102') {
        pdfUrl = `${baseUrl}/pdfs/REG102.pdf`;
      } else if (formType === 'Reg343') {
        pdfUrl = `${baseUrl}/pdfs/Reg343.pdf`;
      } else {
        pdfUrl = `${baseUrl}/pdfs/Reg227.pdf`;
      }
      
      const pdfResponse = await fetch(pdfUrl);
      if (!pdfResponse.ok) {
        throw new Error(`Failed to fetch the PDF file: ${formType}`);
      }
      const existingPdfBytes = await pdfResponse.arrayBuffer();

      let modifiedPdfBytes;
      if (formType === 'DMVREG262') {
        modifiedPdfBytes = await modifyDMVREG262Pdf(existingPdfBytes, formData);
      } else if (formType === 'Reg101') {
        modifiedPdfBytes = await modifyReg101Pdf(existingPdfBytes, formData);
      } else if (formType === 'Reg256') {
        modifiedPdfBytes = await modifyReg256Pdf(existingPdfBytes, formData);
      } else if (formType === 'Reg156') {
        modifiedPdfBytes = await modifyReg156Pdf(existingPdfBytes, formData);
      } else if (formType === 'DMVReg166') {
        modifiedPdfBytes = await modifyDMVReg166Pdf(existingPdfBytes, formData);
      } else if (formType === 'REG195') {
        modifiedPdfBytes = await modifyREG195Pdf(existingPdfBytes, formData);
      } else if (formType === 'DMV14') {
        modifiedPdfBytes = await modifyDMV14Pdf(existingPdfBytes, formData);
      } else if (formType === 'REG17') {
        modifiedPdfBytes = await modifyREG17Pdf(existingPdfBytes, formData, effectiveTransactionType);
      } else if (formType === 'REG102') {
        modifiedPdfBytes = await modifyREG102Pdf(existingPdfBytes, formData, effectiveTransactionType);
      } else if (formType === 'Reg343') {
        modifiedPdfBytes = await modifyReg343Pdf(existingPdfBytes, formData, effectiveTransactionType);
      } else {
        modifiedPdfBytes = await modifyReg227Pdf(existingPdfBytes, formData, effectiveTransactionType);
      }

      return new Response(modifiedPdfBytes, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="filled-${formType.toLowerCase()}-form.pdf"`,
        },
      });
    }
  } catch (error) {
    console.error(`[fillPdfForm] Error:`, error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

async function modifyReg343Pdf(fileBytes: ArrayBuffer, formData: any, effectiveTransactionType?: string): Promise<Uint8Array> {
  try {
    const pdfDoc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
    
    if (!pdfDoc) {
      console.error('Failed to load PDF document');
      throw new Error('Failed to load PDF document');
    }
    
    const form = pdfDoc.getForm();
    
    if (!form) {
      console.error('Failed to get form from PDF');
      throw new Error('Failed to get form from PDF');
    }
    
    console.log('Processing Reg343 form (Out of State Title)');
    

    const safeSetCheckbox = (fieldName: string, checked: boolean) => {
      try {
        const field = form.getCheckBox(fieldName);
        if (field) {
          if (checked) {
            field.check();
          } else {
            field.uncheck();
          }
          console.log(`Successfully set checkbox: ${fieldName} to ${checked}`);
        } else {
          console.warn(`Checkbox field not found: ${fieldName}`);
        }
      } catch (error) {
        console.error(`Error setting checkbox ${fieldName}:`, error);
      }
    };
    
    const safeSetText = (fieldName: string, value: string) => {
      try {
        const field = form.getTextField(fieldName);
        if (field) {
          field.setText(value);
          console.log(`Successfully filled field: ${fieldName} with: ${value}`);
        } else {
          console.warn(`Field not found: ${fieldName}`);
        }
      } catch (error) {
        console.error(`Error filling field ${fieldName}:`, error);
      }
    };
    
    const safeSetRadio = (fieldName: string, value: string) => {
      try {
        const field = form.getRadioGroup(fieldName);
        if (field) {
          field.select(value);
          console.log(`Successfully set radio group: ${fieldName} to ${value}`);
        } else {
          console.warn(`Radio group field not found: ${fieldName}`);
        }
      } catch (error) {
        console.error(`Error setting radio group ${fieldName}:`, error);
      }
    };
    

    try {
      const today = new Date();
      const formattedDate = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;
      

      safeSetText('Text28', formattedDate);
      safeSetText('Text58', formattedDate);
    } catch (error) {
      console.error('Error setting date:', error);
    }
    

    let vinSetInText56 = false;
    

    if (formData.vehicleInformation) {
      const vehicleInfo = formData.vehicleInformation;
      

      if (vehicleInfo.hullId) {
        const vinDigits = vehicleInfo.hullId.split('');
        

        for (let i = 0; i < Math.min(vinDigits.length, 18); i++) {

          const fieldIndex = i + 1;
          

          safeSetText(`Text9.${fieldIndex}`, vinDigits[i]);
        }
        

        vinSetInText56 = true;
        

        safeSetText('Text27', vehicleInfo.hullId);
      }
      

      if (vehicleInfo.make) {
        safeSetText('Text10', vehicleInfo.make);
      }
      

      if (vehicleInfo.year) {
        safeSetText('Text11', vehicleInfo.year.toString());
      }
      

      const isMotorcycle = vehicleInfo.isMotorcycle || formData.vehicleTransactionDetails?.isMotorcycle;
      if (vehicleInfo.engineNumber) {
        safeSetText('Text18', vehicleInfo.engineNumber);
      }
      

      if (vehicleInfo.licensePlate) {
        safeSetText('Text4', vehicleInfo.licensePlate);

        safeSetText('Text21', vehicleInfo.licensePlate);
      }
      

      if (vehicleInfo.mileage) {
        safeSetText('Text24', vehicleInfo.mileage);
        safeSetText('Text31', vehicleInfo.mileage);
      }
      

      if (vehicleInfo.notActualMileage) {
        safeSetCheckbox('Check1', true);
      }
      
      if (vehicleInfo.exceedsMechanicalLimit) {
        safeSetCheckbox('Check2', true);
      }
    }
    

    if (formData.owners && formData.owners.length > 0) {
      const owner = formData.owners[0];
      

      if (owner.firstName || owner.middleName || owner.lastName) {
        const fullName = [
          owner.firstName || '',
          owner.middleName || '',
          owner.lastName || ''
        ].filter(Boolean).join(' ');
        

        safeSetText('Text5', fullName);
        safeSetText('Text26', fullName);
        safeSetText('Text34', fullName);
        

        safeSetText('Text62', fullName);
      }
      

      if (owner.licenseNumber) {
        safeSetText('Text6', owner.licenseNumber);
        safeSetText('Text35', owner.licenseNumber);
        

        const dlDigits = owner.licenseNumber.split('');
        

        const dlFieldNames = [
          'Owner DL no',
          'owner second digit',
          'owner third digit',
          'owner fourth digit',
          'owner fifth digit',
          'owner sixth digit',
          'owner seventh digit',
          'owner eighth digit'
        ];
        

        for (let i = 0; i < Math.min(dlDigits.length, dlFieldNames.length); i++) {
          safeSetText(dlFieldNames[i], dlDigits[i]);
        }
      }
      

      if (owner.state) {
        safeSetText('Text64', owner.state);
      }
      

      if (owner.phoneNumber || owner.phone) {
        const phone = owner.phoneNumber || owner.phone;
        safeSetText('Text36', phone);
        safeSetText('Text47', phone);
      }
    }
    

    if (formData.address) {
      const address = formData.address;
      

      if (address.street) {
        safeSetText('Text7', address.street);
        safeSetText('Text37', address.street);
        safeSetText('Text82', address.street);
      }
      
      if (address.apt) {
        safeSetText('Text83', address.apt);
      }
      
      if (address.city) {
        safeSetText('Text9', address.city);
        safeSetText('Text38', address.city);
        safeSetText('Text85', address.city);
      }
      
      if (address.state) {
        safeSetText('Text10', address.state);
        safeSetText('Text39', address.state);
        safeSetText('Text86', address.state);
      }
      
      if (address.zip) {
        safeSetText('Text11', address.zip);
        safeSetText('Text40', address.zip);
        safeSetText('Text87', address.zip);
      }
    }
    

    if (formData.mailingAddressDifferent && formData.mailingAddress) {
      const mailingAddress = formData.mailingAddress;
      
      if (mailingAddress.street) {
        safeSetText('Text90', mailingAddress.street);
      }
      
      if (mailingAddress.poBox) {
        safeSetText('Text91', mailingAddress.poBox);
      }
      
      if (mailingAddress.city) {
        safeSetText('Text92', mailingAddress.city);
      }
      
      if (mailingAddress.state) {
        safeSetText('Text93', mailingAddress.state);
      }
      
      if (mailingAddress.zip) {
        safeSetText('Text94', mailingAddress.zip);
      }
    }
    

    if (formData.lesseeAddressDifferent && formData.lesseeAddress) {
      const lesseeAddress = formData.lesseeAddress;
      
      if (lesseeAddress.street) {
        safeSetText('Text95', lesseeAddress.street);
      }
      
      if (lesseeAddress.apt) {
        safeSetText('Text109', lesseeAddress.apt);
      }
      
      if (lesseeAddress.city) {
        safeSetText('Text110', lesseeAddress.city);
      }
      
      if (lesseeAddress.state) {
        safeSetText('Text111', lesseeAddress.state);
      }
      
      if (lesseeAddress.zip) {
        safeSetText('Text112', lesseeAddress.zip);
      }
    }
    

    if (formData.trailerLocationDifferent && formData.trailerLocation) {
      const trailerLocation = formData.trailerLocation;
      
      if (trailerLocation.street) {
        safeSetText('Text113', trailerLocation.street);
      }
      
      if (trailerLocation.city) {
        safeSetText('Text115', trailerLocation.city);
      }
      
      if (trailerLocation.state) {
        safeSetText('Text116', trailerLocation.state);
      }
      
      if (trailerLocation.zip) {
        safeSetText('Text117', trailerLocation.zip);
      }
    }
    

    if (formData.owners && formData.owners.length > 1) {
      const coOwner = formData.owners[1];
      

      if (coOwner.relationshipType === 'AND') {
        safeSetCheckbox('Check Box70', true);
      } else if (coOwner.relationshipType === 'OR') {
        safeSetCheckbox('Check Box71', true);
      }
      
      if (coOwner.firstName || coOwner.middleName || coOwner.lastName) {
        const coOwnerName = [
          coOwner.firstName || '',
          coOwner.middleName || '',
          coOwner.lastName || ''
        ].filter(Boolean).join(' ');
        
        safeSetText('Text41', coOwnerName);

        safeSetText('Text73', coOwnerName);
      }
      
      if (coOwner.licenseNumber) {
        safeSetText('Text42', coOwner.licenseNumber);
        

        const dlDigits = coOwner.licenseNumber.split('');
        

        const dlFieldNames = [
          'first co owner dl no',
          'first co owner second digit',
          'first co owner third digit',
          'first co owner fourth digit',
          'first co owner fifth digit',
          'first co owner sixth digit',
          'first co owner seventh digit',
          'first co owner eighth digit'
        ];
        

        for (let i = 0; i < Math.min(dlDigits.length, dlFieldNames.length); i++) {
          safeSetText(dlFieldNames[i], dlDigits[i]);
        }
      }
      

      if (coOwner.state) {
        safeSetText('Text74', coOwner.state);
      }
      

      if (coOwner.address) {
        if (coOwner.address.street) safeSetText('Text43', coOwner.address.street);
        if (coOwner.address.city) safeSetText('Text44', coOwner.address.city);
        if (coOwner.address.state) safeSetText('Text45', coOwner.address.state);
        if (coOwner.address.zip) safeSetText('Text46', coOwner.address.zip);
      }
    }

    if (formData.lienHolder) {
      const lienHolder = formData.lienHolder;
      

      if (lienHolder.name) {
        safeSetText('Text118', lienHolder.name);
      }
      

      if (lienHolder.eltNumber) {
        safeSetText('Text119', lienHolder.eltNumber);
      }
      

      if (lienHolder.address) {
        const address = lienHolder.address;
        

        if (address.street) {
          safeSetText('Text120', address.street);
        }
        

        if (address.apt) {
          safeSetText('Text121', address.apt);
        }
        

        if (address.city) {
          safeSetText('Text122', address.city);
        }
        

        if (address.state) {
          safeSetText('Text123', address.state);
        }
        

        if (address.zip) {
          safeSetText('Text124', address.zip);
        }
      }
      

      if (lienHolder.mailingAddressDifferent && lienHolder.mailingAddress) {
        const mailingAddress = lienHolder.mailingAddress;
        

        if (mailingAddress.street) {
          safeSetText('Text125', mailingAddress.street);
        }
        

        if (mailingAddress.poBox) {
          safeSetText('Text126', mailingAddress.poBox);
        }
        

        if (mailingAddress.city) {
          safeSetText('Text127', mailingAddress.city);
        }
        

        if (mailingAddress.state) {
          safeSetText('Text128', mailingAddress.state);
        }
        

        if (mailingAddress.zip) {
          safeSetText('Text129', mailingAddress.zip);
        }
      }
    }

    if (formData.vehicleInformation && formData.vehicleInformation.mileage) {
      const mileage = formData.vehicleInformation.mileage.toString().padStart(6, '0');
      

      for (let i = 0; i < Math.min(mileage.length, 6); i++) {
        safeSetText(`Text132.${i}`, mileage[i]);
      }
    }    
    



if (formData.lienHolder) {
  const lienHolder = formData.lienHolder;
  

  if (lienHolder.name) {
    safeSetText('Text118', lienHolder.name);
  }


if (formData.vehicleInformation && formData.vehicleInformation.mileage) {
  const mileage = formData.vehicleInformation.mileage.toString().padStart(6, '0');
  

  for (let i = 0; i < Math.min(mileage.length, 6); i++) {
    safeSetText(`Text132.${i}`, mileage[i]);
  }
  

  safeSetText('Text24', formData.vehicleInformation.mileage);
  safeSetText('Text31', formData.vehicleInformation.mileage);
}


if (formData.owners && formData.owners.length > 0) {

  const saleDate = formData.sellerInfo?.sellers?.[0]?.saleDate || '';
  

  if (formData.owners.length >= 1) {
    const owner1 = formData.owners[0];
    

    const owner1FullName = [
      owner1.firstName || '',
      owner1.middleName || '',
      owner1.lastName || ''
    ].filter(Boolean).join(' ');
    

    safeSetText('Text184', owner1FullName);
    

    safeSetText('Text185', saleDate);
    

    if (owner1.phoneNumber || owner1.phone) {
      const phone = (owner1.phoneNumber || owner1.phone || '').replace(/\D/g, '');
      if (phone.length >= 3) {
        safeSetText('Text186', phone.substring(0, 3));
        safeSetText('Text187', phone.substring(3));
      }
    }
  }
  

  if (formData.owners.length >= 2) {
    const owner2 = formData.owners[1];
    

    const owner2FullName = [
      owner2.firstName || '',
      owner2.middleName || '',
      owner2.lastName || ''
    ].filter(Boolean).join(' ');
    

    if (owner2FullName.trim()) {

      safeSetText('Text188', owner2FullName);
      

      safeSetText('Text189', saleDate);
      

      if (owner2.phoneNumber || owner2.phone) {
        const phone = (owner2.phoneNumber || owner2.phone || '').replace(/\D/g, '');
        if (phone.length >= 3) {
          safeSetText('Text190', phone.substring(0, 3));
          safeSetText('Text191', phone.substring(3));
        }
      }
    }
  }
  

  if (formData.owners.length >= 3) {
    const owner3 = formData.owners[3-1];
    

    const owner3FullName = [
      owner3.firstName || '',
      owner3.middleName || '',
      owner3.lastName || ''
    ].filter(Boolean).join(' ');
    

    if (owner3FullName.trim()) {

      safeSetText('Text192', owner3FullName);
      

      safeSetText('Text193', saleDate);
      

      if (owner3.phoneNumber || owner3.phone) {
        const phone = (owner3.phoneNumber || owner3.phone || '').replace(/\D/g, '');
        if (phone.length >= 3) {
          safeSetText('Text194', phone.substring(0, 3));
          safeSetText('Text195', phone.substring(3));
        }
      }
    }}}}

    if (formData.owners && formData.owners.length > 2) {
      const owner3 = formData.owners[2];
      

      if (owner3.relationshipType === 'AND') {
        safeSetCheckbox('Check Box77', true);
      } else if (owner3.relationshipType === 'OR') {
        safeSetCheckbox('Check Box80', true);
      }
      
      if (owner3.firstName || owner3.middleName || owner3.lastName) {
        const owner3Name = [
          owner3.firstName || '',
          owner3.middleName || '',
          owner3.lastName || ''
        ].filter(Boolean).join(' ');
        

        safeSetText('Text81', owner3Name);
      }
      
      if (owner3.licenseNumber) {

        const dlDigits = owner3.licenseNumber.split('');
        

        const dlFieldNames = [
          'second co owner',
          'second co owner second digit',
          'second co owner third digit',
          'second co owner fourth digit',
          'second co owner fifth digit',
          'second co owner sixth digit',
          'second co owner seventh digit',
          'second co owner eighth digit'
        ];
        

        for (let i = 0; i < Math.min(dlDigits.length, dlFieldNames.length); i++) {
          safeSetText(dlFieldNames[i], dlDigits[i]);
        }
      }
      

      if (owner3.state) {
        safeSetText('Text75', owner3.state);
      }
    }
    

    try {

      safeSetText('Text55', '[Signature on file]');
      safeSetText('Text57', '[Signature on file]');
    } catch (error) {
      console.error('Error setting signature:', error);
    }
    

    if (formData.lienholders && formData.lienholders.length > 0) {
      const lienholder = formData.lienholders[0];
      
      if (lienholder.name) {
        safeSetText('Text48', lienholder.name);
      }
      
      if (lienholder.address) {

        const lienholderAddress = [
          lienholder.address.street || '',
          lienholder.address.city ? `${lienholder.address.city},` : '',
          lienholder.address.state || '',
          lienholder.address.zip || ''
        ].filter(Boolean).join(' ');
        
        safeSetText('Text51.0', lienholderAddress);
      }
    }
    


    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 8; j++) {
        if (i === 0 && j === 5) continue;
        safeSetText(`Text25.${i}.${j}`, '');
      }
    }
    

    if (!vinSetInText56) {

      for (let i = 0; i < 18; i++) {
        safeSetText(`Text56.${i}`, '');
      }
    }
    
    try {
      form.updateFieldAppearances();
    } catch (e) {
      console.warn('Error updating field appearances, continuing anyway:', e);
    }
    
    return await pdfDoc.save({
      useObjectStreams: false,
      addDefaultPage: false,
      updateFieldAppearances: false
    });
  } catch (error) {
    console.error('Error in modifyReg343Pdf:', error);
    const emptyPdf = await PDFDocument.create();
    return await emptyPdf.save();
  }
}


async function modifyREG102Pdf(fileBytes: ArrayBuffer, formData: any, effectiveTransactionType?: string): Promise<Uint8Array> {
  try {
    const pdfDoc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
    
    if (!pdfDoc) {
      console.error('Failed to load PDF document');
      throw new Error('Failed to load PDF document');
    }
    
    const form = pdfDoc.getForm();
    
    if (!form) {
      console.error('Failed to get form from PDF');
      throw new Error('Failed to get form from PDF');
    }    console.log('Incoming effectiveTransactionType parameter:', effectiveTransactionType);    console.log('Raw formData.type:', formData.type);
    console.log('Raw formData.transactionType:', formData.transactionType);    let transactionType = '';
    
    if (effectiveTransactionType) {      transactionType = effectiveTransactionType;
      console.log(`Using provided effectiveTransactionType: "${transactionType}"`);
    } else if (formData.type) {
      transactionType = formData.type;
      console.log(`Found transaction type in formData.type: "${transactionType}"`);
    } else if (formData.transactionType) {
      transactionType = formData.transactionType;
      console.log(`Found transaction type in formData.transactionType: "${transactionType}"`);
    } else if (formData.formData && formData.formData.type) {
      transactionType = formData.formData.type;
      console.log(`Found transaction type in formData.formData.type: "${transactionType}"`);
    } else if (formData.formData && formData.formData.transactionType) {
      transactionType = formData.formData.transactionType;
      console.log(`Found transaction type in formData.formData.transactionType: "${transactionType}"`);
    }    if (!transactionType && formData.pnoDetails) {
      transactionType = "Filing PNO Transfer";
      console.log(`No transaction type found, but pnoDetails exists. Setting to: "${transactionType}"`);
    }
    
    const isFilingPNOTransfer = transactionType === "Filing PNO Transfer";
    const isCertificateOfNonOperationTransfer = transactionType === "Certificate Of Non-Operation Transfer";
    
    console.log(`Processing REG102 form for ${transactionType || 'unknown'} transaction type`);
    console.log(`isFilingPNOTransfer: ${isFilingPNOTransfer}, isCertificateOfNonOperationTransfer: ${isCertificateOfNonOperationTransfer}`);    const fields = form.getFields();
    console.log(`Found ${fields.length} form fields in REG102 PDF:`);    interface FieldInfo {
      name: string;
      type: string;
    }
    
    interface RadioFieldInfo extends FieldInfo {
      options: string[];
    }    const textFields: FieldInfo[] = [];
    const checkboxFields: FieldInfo[] = [];
    const radioGroupFields: RadioFieldInfo[] = [];
    const otherFields: FieldInfo[] = [];
    
    fields.forEach(field => {
      const fieldName = field.getName();
      const fieldType = field.constructor.name;
      
      if (fieldType === 'PDFTextField') {
        textFields.push({ name: fieldName, type: fieldType });
      } else if (fieldType === 'PDFCheckBox') {
        checkboxFields.push({ name: fieldName, type: fieldType });
      } else if (fieldType === 'PDFRadioGroup') {
        const radioGroup = field as any;        const options = radioGroup.getOptions ? radioGroup.getOptions() : [];
        radioGroupFields.push({ name: fieldName, type: fieldType, options });
      } else {
        otherFields.push({ name: fieldName, type: fieldType });
      }
    });
    
    console.log('Text Fields:', textFields);
    console.log('Checkbox Fields:', checkboxFields);
    console.log('Radio Group Fields:', radioGroupFields);
    console.log('Other Fields:', otherFields);    const safeSetCheckbox = (fieldName: string, checked: boolean) => {
      try {
        const field = form.getCheckBox(fieldName);
        if (field) {
          if (checked) {
            field.check();
          } else {
            field.uncheck();
          }
          console.log(`Successfully set checkbox: ${fieldName} to ${checked}`);
        } else {
          console.warn(`Checkbox field not found: ${fieldName}`);
        }
      } catch (error) {
        console.error(`Error setting checkbox ${fieldName}:`, error);
      }
    };
    
    const safeSetText = (fieldName: string, value: string) => {
      try {
        const field = form.getTextField(fieldName);
        if (field) {
          field.setText(value);
          console.log(`Successfully filled field: ${fieldName}`);
        } else {
          console.warn(`Field not found: ${fieldName}`);
        }
      } catch (error) {
        console.error(`Error filling field ${fieldName}:`, error);
      }
    };    try {
      const today = new Date();
      const formattedDate = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;
      
      if (isCertificateOfNonOperationTransfer) {        safeSetText('certify date', formattedDate);
        console.log(`Set certify date for Certificate Of Non-Operation Transfer: ${formattedDate}`);
      } else if (isFilingPNOTransfer) {        safeSetText('cert date', formattedDate);
        console.log(`Set cert date for Filing PNO Transfer: ${formattedDate}`);
      } else {        console.log(`Skipping date fields for unknown transaction type: ${transactionType}`);
      }
    } catch (error) {
      console.error('Error setting certification date:', error);
    }    if (formData.storageLocation) {
      const storage = formData.storageLocation;
      
      if (isCertificateOfNonOperationTransfer) {        if (storage.fromDate) {
          const fromDateParts = storage.fromDate.split('/');
          if (fromDateParts.length === 3) {
            safeSetText('from month.0', fromDateParts[0]);
            safeSetText('from day.0', fromDateParts[1]);
            safeSetText('from year.0', fromDateParts[2]);
            console.log(`Set storage from date for Certificate Of Non-Operation Transfer: ${storage.fromDate}`);
          }
        }
        
        if (storage.toDate) {
          const toDateParts = storage.toDate.split('/');
          if (toDateParts.length === 3) {
            safeSetText('to month', toDateParts[0]);
            safeSetText('to day', toDateParts[1]);
            safeSetText('to year', toDateParts[2]);
            console.log(`Set storage to date for Certificate Of Non-Operation Transfer: ${storage.toDate}`);
          }
        }
        
        if (storage.address) {
          safeSetText('address', storage.address);
          console.log(`Set storage address for Certificate Of Non-Operation Transfer: ${storage.address}`);
        }
        
        if (storage.city) {
          safeSetText('city', storage.city);
          console.log(`Set storage city for Certificate Of Non-Operation Transfer: ${storage.city}`);
        }
        
        if (storage.state) {
          safeSetText('state', storage.state);
          console.log(`Set storage state for Certificate Of Non-Operation Transfer: ${storage.state}`);
        }
        
        if (storage.zipCode) {
          safeSetText('zip', storage.zipCode);
          console.log(`Set storage zip code for Certificate Of Non-Operation Transfer: ${storage.zipCode}`);
        }
      } else {
        console.log('Storage location data skipped for transaction type:', transactionType);
      }
    }    if (formData.pnoDetails) {
      const pnoDetails = formData.pnoDetails;
      
      try {        const allCheckboxes = checkboxFields.map(field => field.name.toLowerCase());
        const hasBeforeExpiration = allCheckboxes.includes('beforeexpiration');
        const hasAfterExpiration = allCheckboxes.includes('afterexpiration');
        const hasRequestPnoCard = allCheckboxes.includes('requestpnocard');
        
        console.log(`Checkbox availability - BeforeExpiration: ${hasBeforeExpiration}, AfterExpiration: ${hasAfterExpiration}, RequestPnoCard: ${hasRequestPnoCard}`);        if (hasBeforeExpiration || hasAfterExpiration || hasRequestPnoCard) {
          if ((isFilingPNOTransfer || isCertificateOfNonOperationTransfer) && 
              pnoDetails.isBeforeRegExpires) {
            if (hasBeforeExpiration) {
              safeSetCheckbox('BeforeExpiration', true);
              console.log(`Set before registration expires checkbox for ${transactionType}`);
            }
          } else if ((isFilingPNOTransfer || isCertificateOfNonOperationTransfer) && 
                     !pnoDetails.isBeforeRegExpires && 
                     hasAfterExpiration) {
            safeSetCheckbox('AfterExpiration', true);
            console.log(`Set after registration expires checkbox for ${transactionType}`);
          }
          
          if ((isFilingPNOTransfer || isCertificateOfNonOperationTransfer) && 
              pnoDetails.requestPnoCard && 
              hasRequestPnoCard) {
            safeSetCheckbox('RequestPnoCard', true);
            console.log(`Set request PNO card checkbox for ${transactionType}`);
          }
        } else {
          console.log('PNO checkboxes not found in form');
        }
      } catch (error) {
        console.error('Error setting PNO checkboxes:', error);
      }
    }    interface VehicleEntry {
      vehicleLicensePlate?: string;
      vehicleIdNumber?: string;
      vehicleMake?: string;
      equipmentNumber?: string;
      [key: string]: any;    }    if (formData.plannedNonOperation && formData.plannedNonOperation.entries) {      const entries = formData.plannedNonOperation.entries.filter((entry: VehicleEntry) => 
        entry.vehicleLicensePlate || entry.vehicleIdNumber || entry.vehicleMake || entry.equipmentNumber
      );
      
      console.log(`Processing ${entries.length} non-empty vehicle entries for ${transactionType}`);
      
      if (isFilingPNOTransfer) {        const maxEntries = Math.min(entries.length, 9);        
        for (let i = 0; i < maxEntries; i++) {
          const entry = entries[i];
          
          if (entry.vehicleLicensePlate) {
            safeSetText(`veh lic plate #.${i}`, entry.vehicleLicensePlate);
            console.log(`Set veh lic plate #.${i} to ${entry.vehicleLicensePlate} for Filing PNO Transfer`);
          }
          
          if (entry.vehicleIdNumber) {
            safeSetText(`veh id #.${i}`, entry.vehicleIdNumber);
            console.log(`Set veh id #.${i} to ${entry.vehicleIdNumber} for Filing PNO Transfer`);
          }
          
          if (entry.vehicleMake) {
            safeSetText(`veh make.${i}`, entry.vehicleMake);
            console.log(`Set veh make.${i} to ${entry.vehicleMake} for Filing PNO Transfer`);
          }
          
          if (entry.equipmentNumber) {
            safeSetText(`veh equip #.${i}`, entry.equipmentNumber);
            console.log(`Set veh equip #.${i} to ${entry.equipmentNumber} for Filing PNO Transfer`);
          }
        }
      } else if (isCertificateOfNonOperationTransfer) {        const maxEntries = Math.min(entries.length, 7);        
        for (let i = 0; i < maxEntries; i++) {
          const entry = entries[i];
          
          if (entry.vehicleLicensePlate) {
            safeSetText(`license plate #.${i}`, entry.vehicleLicensePlate);
            console.log(`Set license plate #.${i} to ${entry.vehicleLicensePlate} for Certificate Of Non-Operation Transfer`);
          }
          
          if (entry.vehicleIdNumber) {
            safeSetText(`vin.${i}`, entry.vehicleIdNumber);
            console.log(`Set vin.${i} to ${entry.vehicleIdNumber} for Certificate Of Non-Operation Transfer`);
          }
          
          if (entry.vehicleMake) {
            safeSetText(`make.${i}`, entry.vehicleMake);
            console.log(`Set make.${i} to ${entry.vehicleMake} for Certificate Of Non-Operation Transfer`);
          }
          
          if (entry.equipmentNumber) {
            safeSetText(`equip #.${i}`, entry.equipmentNumber);
            console.log(`Set equip #.${i} to ${entry.equipmentNumber} for Certificate Of Non-Operation Transfer`);
          }
        }
      } else {
        console.log(`Skipping vehicle entries for unknown transaction type: ${transactionType}`);
      }
    }    if (formData.sellerInfo && formData.sellerInfo.sellers && formData.sellerInfo.sellers.length > 0) {
      const seller = formData.sellerInfo.sellers[0];      if (seller.firstName || seller.middleName || seller.lastName) {
        const fullName = [
          seller.firstName || '',
          seller.middleName || '',
          seller.lastName || ''
        ].filter(Boolean).join(' ');
        
        safeSetText('OwnerName', fullName);
        console.log(`Set owner name for ${transactionType}: ${fullName}`);
      }
      
      if (seller.licenseNumber) {
        safeSetText('DriverLicense', seller.licenseNumber);
        console.log(`Set driver license for ${transactionType}: ${seller.licenseNumber}`);
      }
      
      if (seller.dob) {
        safeSetText('OwnerDOB', seller.dob);
        console.log(`Set owner date of birth for ${transactionType}: ${seller.dob}`);
      }      if (seller.phone) {        const cleanPhone = seller.phone.replace(/\D/g, '');
        
        if (cleanPhone.length >= 10) {          const areaCode = cleanPhone.substring(0, 3);          const phoneNumber = cleanPhone.substring(3);
          
          if (isFilingPNOTransfer) {            safeSetText('daytime area code', areaCode);
            safeSetText('daytime phone', phoneNumber);
            console.log(`Set daytime area code and daytime phone for Filing PNO Transfer: (${areaCode}) ${phoneNumber}`);
          } else if (isCertificateOfNonOperationTransfer) {            safeSetText('area code', areaCode);
            safeSetText('phone', phoneNumber);
            console.log(`Set area code and phone for Certificate Of Non-Operation Transfer: (${areaCode}) ${phoneNumber}`);
          } else {
            console.log(`Skipping phone fields for unknown transaction type: ${transactionType}`);
          }
        } else if (cleanPhone.length > 0) {          let areaCode = '';
          let phoneNumber = cleanPhone;
          
          if (cleanPhone.length > 3) {
            areaCode = cleanPhone.substring(0, 3);
            phoneNumber = cleanPhone.substring(3);
          }
          
          if (isFilingPNOTransfer) {
            safeSetText('daytime area code', areaCode);
            safeSetText('daytime phone', phoneNumber);
          } else if (isCertificateOfNonOperationTransfer) {
            safeSetText('area code', areaCode);
            safeSetText('phone', phoneNumber);
          } else {
            console.log(`Skipping phone fields for unknown transaction type: ${transactionType}`);
          }
        }
      }
    }    if (formData.sellerAddress) {
      const address = formData.sellerAddress;      let fullAddress = '';
      if (address.street) {
        fullAddress += address.street;
        safeSetText('StreetAddress', address.street);
        console.log(`Set street address for ${transactionType}: ${address.street}`);
      }
      
      if (address.city) {
        safeSetText('City', address.city);
        console.log(`Set city for ${transactionType}: ${address.city}`);
      }
      
      if (address.state) {
        safeSetText('State', address.state);
        console.log(`Set state for ${transactionType}: ${address.state}`);
      }
      
      if (address.zip) {
        safeSetText('ZipCode', address.zip);
        console.log(`Set zip code for ${transactionType}: ${address.zip}`);
      }
      
      console.log(`Set full address for ${transactionType}: ${fullAddress}`);
    }    if (formData.sellerMailingAddressDifferent && formData.sellerMailingAddress) {
      const mailingAddress = formData.sellerMailingAddress;      let fullMailingAddress = '';
      if (mailingAddress.street) {
        fullMailingAddress += mailingAddress.street;
        safeSetText('MailingStreetAddress', mailingAddress.street);
        console.log(`Set mailing street address for ${transactionType}: ${mailingAddress.street}`);
      }
      
      if (mailingAddress.city) {
        safeSetText('MailingCity', mailingAddress.city);
        console.log(`Set mailing city for ${transactionType}: ${mailingAddress.city}`);
      }
      
      if (mailingAddress.state) {
        safeSetText('MailingState', mailingAddress.state);
        console.log(`Set mailing state for ${transactionType}: ${mailingAddress.state}`);
      }
      
      if (mailingAddress.zip) {
        safeSetText('MailingZipCode', mailingAddress.zip);
        console.log(`Set mailing zip code for ${transactionType}: ${mailingAddress.zip}`);
      }
      
      console.log(`Set mailing address for ${transactionType}: ${fullMailingAddress}`);
    }    try {
      const hasOwnerSignature = textFields.some(field => field.name === 'OwnerSignature');
      if (hasOwnerSignature) {
        safeSetText('OwnerSignature', '[Signature on file]');
        console.log(`Set signature placeholder for ${transactionType}`);
      } else {
        console.log('OwnerSignature field not found in form');
      }
    } catch (error) {
      console.error('Error setting signature:', error);
    }
    
    try {
      form.updateFieldAppearances();
    } catch (e) {
      console.warn('Error updating field appearances, continuing anyway:', e);
    }
    
    return await pdfDoc.save({
      useObjectStreams: false,
      addDefaultPage: false,
      updateFieldAppearances: false
    });
  } catch (error) {
    console.error('Error in modifyREG102Pdf:', error);
    const emptyPdf = await PDFDocument.create();
    return await emptyPdf.save();
  }
}

async function modifyREG17Pdf(fileBytes: ArrayBuffer, formData: any, transactionType?: string): Promise<Uint8Array> {
  try {
    const pdfDoc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
    
    if (!pdfDoc) {
      console.error('Failed to load PDF document');
      throw new Error('Failed to load PDF document');
    }
    
    const form = pdfDoc.getForm();
    
    if (!form) {
      console.error('Failed to get form from PDF');
      throw new Error('Failed to get form from PDF');
    }
    
    console.log('Processing REG17 form for transaction type:', transactionType);
    

    const safeSetCheckbox = (fieldName: string, checked: boolean) => {
      try {
        const field = form.getCheckBox(fieldName);
        if (field) {
          if (checked) {
            field.check();
          } else {
            field.uncheck();
          }
          console.log(`Successfully set checkbox: ${fieldName} to ${checked}`);
        } else {
          console.warn(`Checkbox field not found: ${fieldName}`);
        }
      } catch (error) {
        console.error(`Error setting checkbox ${fieldName}:`, error);
      }
    };
    
    const safeSetText = (fieldName: string, value: string) => {
      try {
        const field = form.getTextField(fieldName);
        if (field) {
          field.setText(value);
          console.log(`Successfully filled field: ${fieldName}`);
        } else {
          console.warn(`Field not found: ${fieldName}`);
        }
      } catch (error) {
        console.error(`Error filling field ${fieldName}:`, error);
      }
    };
    

    try {
      const today = new Date();
      const formattedDate = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;
      safeSetText("Text74", formattedDate);
      console.log(`Set current date fields with: ${formattedDate}`);
    } catch (error) {
      console.error('Error setting current date:', error);
    }
    

    if (transactionType === "Personalized Plates (Order)") {
      console.log('Transaction type is "Personalized Plates (Order)", checking Check Box1');
      safeSetCheckbox("Check Box1", true);
    } else if (transactionType === "Personalized Plates (Replacement)") {
      console.log('Transaction type is "Personalized Plates (Replacement)", checking Check Box2');
      safeSetCheckbox("Check Box2", true);
    } else if (transactionType === "Personalized Plates (Reassignment)") {
      console.log('Transaction type is "Personalized Plates (Reassignment)", checking Check Box3');
      safeSetCheckbox("Check Box3", true);
    } else if (transactionType === "Personalized Plates (Exchange)") {
      console.log('Transaction type is "Personalized Plates (Exchange)", checking Check Box4');
      safeSetCheckbox("Check Box4", true);
    } else {
      console.log('Unknown transaction type:', transactionType);
    }
    

    if (transactionType === "Personalized Plates (Reassignment)" && formData.reassignmentSection) {
      const reassignmentInfo = formData.reassignmentSection;
      console.log('Processing reassignment section information:', reassignmentInfo);
      

      if (reassignmentInfo.specialInterestLicensePlate) {
        safeSetText('Text56', reassignmentInfo.specialInterestLicensePlate);
        console.log(`Set special interest license plate number: ${reassignmentInfo.specialInterestLicensePlate}`);
      }
      

      if (reassignmentInfo.removedFrom) {
        safeSetText('Text57', reassignmentInfo.removedFrom);
        console.log(`Set removed from VIN: ${reassignmentInfo.removedFrom}`);
      }
      

      if (reassignmentInfo.placedOnLicensePlate) {
        safeSetText('Text58', reassignmentInfo.placedOnLicensePlate);
        console.log(`Set placed on license plate: ${reassignmentInfo.placedOnLicensePlate}`);
      }
      

      if (reassignmentInfo.placedOnVehicle) {
        safeSetText('Text59', reassignmentInfo.placedOnVehicle);
        console.log(`Set placed on vehicle VIN: ${reassignmentInfo.placedOnVehicle}`);
      }
      

      if (reassignmentInfo.retainInterest) {
        safeSetCheckbox('Check Box60', true);
        console.log('Checked retain interest checkbox');
      }
      

      if (reassignmentInfo.feeEnclosed) {
        safeSetCheckbox('Check Box61', true);
        console.log('Checked fee enclosed checkbox');
      }
      

      if (reassignmentInfo.releaseInterestDMV) {
        safeSetCheckbox('Check Box62', true);
        console.log('Checked release interest to DMV checkbox');
      }
      

      if (reassignmentInfo.releaseInterestNewOwner) {
        safeSetCheckbox('Check Box63', true);
        console.log('Checked release interest to new owner checkbox');
      }
    } else if (transactionType === "Personalized Plates (Reassignment)") {
      console.log('Transaction type is Reassignment but no reassignmentSection data provided');
    }
    

    if (transactionType === "Personalized Plates (Replacement)" && formData.replacementSection) {
      const replacementInfo = formData.replacementSection;
      console.log('Processing replacement section information:', replacementInfo);
      

      if (replacementInfo.specialInterestLicensePlate) {
        safeSetText('Text28', replacementInfo.specialInterestLicensePlate);
        console.log(`Set special interest license plate number: ${replacementInfo.specialInterestLicensePlate}`);
      }
      

      if (replacementInfo.ineed === 'One Plate') {
        safeSetCheckbox('Check Box29', true);
        console.log('Selected One Plate option');
      } else if (replacementInfo.ineed === 'Two Plates') {
        safeSetCheckbox('Check Box30', true);
        console.log('Selected Two Plates option');
      }
      

      if (replacementInfo.plateStatus === 'Lost') {
        safeSetCheckbox('Check Box31', true);
        console.log('Selected Lost plate status');
      } else if (replacementInfo.plateStatus === 'Mutilated') {
        safeSetCheckbox('Check Box32', true);
        console.log('Selected Mutilated plate status');
      } else if (replacementInfo.plateStatus === 'Stolen') {
        safeSetCheckbox('Check Box33', true);
        console.log('Selected Stolen plate status');
      }
    } else if (transactionType === "Personalized Plates (Replacement)") {
      console.log('Transaction type is Replacement but no replacementSection data provided');
    }
    

    if (formData.plateSelection) {
      const plateSelection = formData.plateSelection;
      console.log('Processing plate selection:', plateSelection);
      

      const plateTypeMapping: Record<string, string> = {
        'Environmental License Plate (ELP)': 'Check Box5',
        'California Coastal Commission (Whale Tail)': 'Check Box6',
        'Lake Tahoe Conservancy': 'Check Box7',
        'Yosemite Foundation': 'Check Box9',
        'California 1960s Legacy': 'Check Box25',
        'Breast Cancer Awareness': 'Check Box34',
        'California Arts Council': 'Check Box10',
        'California Agricultural (CalAg)': 'Check Box11',
        'California Memorial': 'Check Box13',
        'California Museums (Snoopy)': 'Check Box26',
        'Collegiate (only UCLA is available)': 'Check Box14',
        'Kids - Child Health and Safety Funds': 'Check Box15',
        'Pet Lovers': 'Check Box16',
        'Veterans\' Organization': 'Check Box17',
        'Honoring Veterans Plate': 'Check Box8',
        'Duplicate Decal': 'Check Box12'
      };
      

      const plateType = plateSelection.plateType as string;
      if (plateType && plateType in plateTypeMapping) {
        safeSetCheckbox(plateTypeMapping[plateType], true);
        console.log(`Checked checkbox for plate type: ${plateType} -> ${plateTypeMapping[plateType]}`);
      } else if (plateType) {
        console.warn(`No mapping found for plate type: ${plateType}`);
      }
      

      if (plateType === 'Veterans\' Organization' && plateSelection.organizationalCode) {
        safeSetText('Text18', plateSelection.organizationalCode);
        console.log(`Set organization code: ${plateSelection.organizationalCode}`);
      }
      

      if (plateType === 'Duplicate Decal' && plateSelection.duplicateDecalNumber) {
        safeSetText('Text13', plateSelection.duplicateDecalNumber);
        console.log(`Set duplicate decal number: ${plateSelection.duplicateDecalNumber}`);
      }
    }
    

    if (formData.selectConfiguration) {
      const selectConfig = formData.selectConfiguration;
      console.log('Processing select configuration:', selectConfig);
      

      if (selectConfig.vehicleType) {
        const vehicleTypeMapping: Record<string, string> = {
          'Automobile': 'Check Box19',
          'Commercial': 'Check Box20',
          'Trailer': 'Check Box21',
          'Motorcycle': 'Check Box22'
        };
        
        if (selectConfig.vehicleType in vehicleTypeMapping) {
          safeSetCheckbox(vehicleTypeMapping[selectConfig.vehicleType], true);
          console.log(`Checked vehicle type: ${selectConfig.vehicleType} -> ${vehicleTypeMapping[selectConfig.vehicleType]}`);
        }
      }
      

      if (selectConfig.plateType) {
        if (selectConfig.plateType === 'Sequential') {
          safeSetCheckbox('Check Box23', true);
          console.log('Selected Sequential plate type');
          

          if (selectConfig.currentLicensePlate) {
            safeSetText('Text25', selectConfig.currentLicensePlate);
            console.log(`Set current license plate: ${selectConfig.currentLicensePlate}`);
          }
          
          if (selectConfig.fullVehicleId) {
            safeSetText('Text26', selectConfig.fullVehicleId);
            console.log(`Set full vehicle ID: ${selectConfig.fullVehicleId}`);
          }
        } else if (selectConfig.plateType === 'Personalized') {
          safeSetCheckbox('Check Box27', true);
          console.log('Selected Personalized plate type');
          

          if (selectConfig.personalized) {

            if (selectConfig.personalized.plateNotCentered) {
              safeSetCheckbox('Check Box28', true);
              console.log('Checked plate not centered');
            }
            

            if (selectConfig.personalized.firstChoice) {
              const firstChoice = selectConfig.personalized.firstChoice;
              const textFields = ['Text29', 'Text30', 'Text31', 'Text32', 'Text33', 'Text34', 'Text35', 'Text36'];
              
              for (let i = 0; i < Math.min(firstChoice.length, textFields.length); i++) {
                safeSetText(textFields[i], firstChoice.charAt(i));
              }
              console.log(`Set first choice: ${firstChoice}`);
            }
            

            if (selectConfig.personalized.firstChoiceMeaning) {
              safeSetText('Text37', selectConfig.personalized.firstChoiceMeaning);
              console.log(`Set first choice meaning: ${selectConfig.personalized.firstChoiceMeaning}`);
            }
            

            if (selectConfig.personalized.secondChoice) {
              const secondChoice = selectConfig.personalized.secondChoice;
              const textFields = ['Text38', 'Text39', 'Text40', 'Text41', 'Text42', 'Text43', 'Text44', 'Text45'];
              
              for (let i = 0; i < Math.min(secondChoice.length, textFields.length); i++) {
                safeSetText(textFields[i], secondChoice.charAt(i));
              }
              console.log(`Set second choice: ${secondChoice}`);
            }
            

            if (selectConfig.personalized.secondChoiceMeaning) {
              safeSetText('Text46', selectConfig.personalized.secondChoiceMeaning);
              console.log(`Set second choice meaning: ${selectConfig.personalized.secondChoiceMeaning}`);
            }
            

            if (selectConfig.personalized.thirdChoice) {
              const thirdChoice = selectConfig.personalized.thirdChoice;
              const textFields = ['Text47', 'Text48', 'Text49', 'Text50', 'Text51', 'Text52', 'Text53', 'Text54'];
              
              for (let i = 0; i < Math.min(thirdChoice.length, textFields.length); i++) {
                safeSetText(textFields[i], thirdChoice.charAt(i));
              }
              console.log(`Set third choice: ${thirdChoice}`);
            }
            

            if (selectConfig.personalized.thirdChoiceMeaning) {
              safeSetText('Text55', selectConfig.personalized.thirdChoiceMeaning);
              console.log(`Set third choice meaning: ${selectConfig.personalized.thirdChoiceMeaning}`);
            }
            

          }
        }
      }
      

      if (selectConfig.pickupLocation) {
        if (selectConfig.pickupLocation === 'DMV Office') {
          safeSetCheckbox('Check Box18', true);
          console.log('Selected DMV Office pickup location');
        } else if (selectConfig.pickupLocation === 'Auto Club') {
          safeSetCheckbox('Check Box24', true);
          console.log('Selected Auto Club pickup location');
        }
      }
      

      if (selectConfig.locationCity) {
        safeSetText('Text27', selectConfig.locationCity);
        console.log(`Set location city: ${selectConfig.locationCity}`);
      }
    }
    

    if (formData.platePurchaserOwner) {
      const purchaserOwner = formData.platePurchaserOwner;
      console.log('Processing plate purchaser/owner information:', purchaserOwner);
      

      if (purchaserOwner.purchaser) {
        safeSetText('Text64', purchaserOwner.purchaser.fullName || '');
        safeSetText('Text65', purchaserOwner.purchaser.streetAddress || '');
        safeSetText('Text66', purchaserOwner.purchaser.city || '');
        safeSetText('Text67', purchaserOwner.purchaser.state || '');
        safeSetText('Text68', purchaserOwner.purchaser.zipCode || '');
        

        const phoneNumber = purchaserOwner.purchaser.phoneNumber || purchaserOwner.purchaser.phone || '';
        if (phoneNumber) {

          const cleanedPhone = phoneNumber.replace(/\D/g, '');
          
          if (cleanedPhone.length >= 3) {

            const areaCode = cleanedPhone.substring(0, 3);
            safeSetText('Text75', areaCode);
            

            const restOfPhone = cleanedPhone.substring(3);
            safeSetText('Text76', restOfPhone);
            
            console.log(`Set phone number: (${areaCode}) ${restOfPhone}`);
          }
        } else {

          safeSetText('Text75', '');
          safeSetText('Text76', '');
          console.log('No phone number provided for purchaser');
        }
        
        console.log(`Set purchaser information:
          Name: ${purchaserOwner.purchaser.fullName}
          Address: ${purchaserOwner.purchaser.streetAddress}
          City: ${purchaserOwner.purchaser.city}
          State: ${purchaserOwner.purchaser.state}
          ZIP: ${purchaserOwner.purchaser.zipCode}`);
      }
      

      if (purchaserOwner.sameAsOwner) {
        safeSetCheckbox('Check Box79', true);
        console.log('Checked "Same as Owner" box');
      }
      

      if (!purchaserOwner.sameAsOwner && purchaserOwner.owner) {
        safeSetText('Text69', purchaserOwner.owner.fullName || '');
        safeSetText('Text70', purchaserOwner.owner.streetAddress || '');
        safeSetText('Text71', purchaserOwner.owner.city || '');
        safeSetText('Text72', purchaserOwner.owner.state || '');
        safeSetText('Text73', purchaserOwner.owner.zipCode || '');
        
        console.log(`Set owner information:
          Name: ${purchaserOwner.owner.fullName}
          Address: ${purchaserOwner.owner.streetAddress}
          City: ${purchaserOwner.owner.city}
          State: ${purchaserOwner.owner.state}
          ZIP: ${purchaserOwner.owner.zipCode}`);
      }
    }
    
    try {
      form.updateFieldAppearances();
    } catch (e) {
      console.warn('Error updating field appearances, continuing anyway:', e);
    }
    
    return await pdfDoc.save({
      useObjectStreams: false,
      addDefaultPage: false,
      updateFieldAppearances: false
    });
  } catch (error) {
    console.error('Error in modifyREG17Pdf:', error);
    const emptyPdf = await PDFDocument.create();
    return await emptyPdf.save();
  }
}



async function modifyREG195Pdf(fileBytes: ArrayBuffer, formData: any): Promise<Uint8Array> {
  try {
    const pdfDoc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
    
    if (!pdfDoc) {
      console.error('Failed to load PDF document');
      throw new Error('Failed to load PDF document');
    }
    
    const form = pdfDoc.getForm();
    
    if (!form) {
      console.error('Failed to get form from PDF');
      throw new Error('Failed to get form from PDF');
    }
    
    try {
      const fieldNames = form.getFields().map(f => f.getName());
      console.log('Available REG195 PDF Fields:', JSON.stringify(fieldNames, null, 2));
    } catch (error) {
      console.error('Error getting field names:', error);
    }
    
    console.log('===== COMPLETE FORM DATA =====');
    console.log(JSON.stringify(formData, null, 2));
    console.log('=============================');
    
    const getNestedProperty = (obj: any, path: string): string => {
      if (!obj || !path) return '';
      
      if (path.includes(',')) {
        const paths = path.split(',');
        return paths.map(p => getNestedProperty(obj, p.trim())).join(', ');
      }
      
      const parts = path.split('.');
      let current = obj;
      
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        
        if (current === undefined || current === null) {
          return '';
        }
        
        if (part.match(/^\d+$/) && Array.isArray(current)) {
          const index = parseInt(part);
          current = current[index];
        } else {
          current = current[part];
        }
      }
      
      return current !== undefined && current !== null ? String(current) : '';
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
    
    const safeSetCheckbox = (fieldName: string, checked: boolean) => {
      try {
        const field = form.getCheckBox(fieldName);
        if (field) {
          if (checked) {
            field.check();
          } else {
            field.uncheck();
          }
          console.log(`Successfully set checkbox: ${fieldName} to ${checked}`);
        } else {
          console.warn(`Checkbox not found: ${fieldName}`);
        }
      } catch (error) {
        console.error(`Error setting checkbox ${fieldName}:`, error);
      }
    };
    
    const drawXOnCheckbox = async (fieldName: string, forcedPageIndex?: number, xOffset: number = 5,  yOffset: number = 5) => {
      try {
 
        const field = form.getCheckBox(fieldName);
        
        if (!field) {
          console.warn(`Checkbox field not found: ${fieldName}`);
          return;
        }
        
 
        const widgets = field.acroField.getWidgets();
        if (widgets.length === 0) {
          console.warn(`No widget annotations found for field: ${fieldName}`);
          return;
        }
        
        const widget = widgets[0];
        const rect = widget.getRectangle();
        
 
 
        const x = (rect.x + rect.width / 2) + xOffset;
        const y = (rect.y + rect.height / 2) + yOffset; 
                const size = Math.min(rect.width, rect.height) * 0.7; 
        
 
        let pageIndex = 0;
        
        if (forcedPageIndex !== undefined) {
          pageIndex = forcedPageIndex;
        } else {
          try {
 
            const pageRef = widget.P();
            const pages = pdfDoc.getPages();
            
            for (let i = 0; i < pages.length; i++) {
              if (pages[i].ref === pageRef) {
                pageIndex = i;
                break;
              }
            }
          } catch (error) {
            console.warn(`Could not detect page for field ${fieldName}, using default page 0`);
          }
        }
        
        console.log(`Drawing X on checkbox ${fieldName} on page ${pageIndex} with x-offset: ${xOffset}`);
        
 
        const pageCount = pdfDoc.getPageCount();
        if (pageIndex >= pageCount) {
          console.error(`Page index ${pageIndex} is out of bounds (document has ${pageCount} pages)`);
          return;
        }
        
 
        const page = pdfDoc.getPage(pageIndex);
        
 
        page.drawLine({
          start: { x: x - size/2, y: y - size/2 },
          end: { x: x + size/2, y: y + size/2 },
          thickness: 2,
          color: rgb(0, 0, 0),
        });
        
        page.drawLine({
          start: { x: x - size/2, y: y + size/2 },
          end: { x: x + size/2, y: y - size/2 },
          thickness: 2,
          color: rgb(0, 0, 0),
        });
        
        console.log(`Successfully drew X on checkbox: ${fieldName} on page ${pageIndex}`);
      } catch (error) {
        console.error(`Error drawing X on checkbox ${fieldName}:`, error);
      }
    };
    
 
    const setCurrentDate = () => {
      try {
        const today = new Date();
 
        const formattedDate = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;
        
        safeSetText("Executed-Date", formattedDate);
        console.log(`Successfully filled Executed-Date field with current date: ${formattedDate}`);
      } catch (error) {
        console.error('Error setting current date:', error);
      }
    };
 
    const processSellerInfo = () => {
      try {
 
        const nameField = form.getTextField("Name or organization name");
        if (nameField && formData.sellerInfo?.sellers?.[0]) {
          const seller = formData.sellerInfo.sellers[0];
          const lastName = seller.lastName || '';
          const firstName = seller.firstName || '';
          const middleName = seller.middleName || '';
          
 
          let fullName = lastName;
          if (firstName || middleName) {
            fullName += ', ' + firstName;
            if (middleName) {
              fullName += ' ' + middleName;
            }
          }
          
          nameField.setText(fullName);
          console.log(`Successfully filled seller name field: ${fullName}`);
        }
        
 
        const dlNumber = formData.sellerInfo?.sellers?.[0]?.licenseNumber || '';
        if (dlNumber) {
 
          const dlChars = String(dlNumber).split('');
          
 
          for (let i = 0; i < dlChars.length && i < 8; i++) {
            const fieldName = `DL No.${i}`;
            const field = form.getTextField(fieldName);
            if (field) {
              field.setText(dlChars[i]);
              console.log(`Successfully filled DL digit ${i}: ${dlChars[i]}`);
            }
          }
        }
        
 
        if (formData.sellerAddress) {
 
          safeSetText("Residence or organization address", formData.sellerAddress.street || '');
          safeSetText("Apt/Space.1", formData.sellerAddress.apt || '');
          safeSetText("city", formData.sellerAddress.city || '');
          safeSetText("county", formData.sellerAddress.county || '');
 
          safeSetText("Applicant-State", formData.sellerInfo?.sellers?.[0]?.state || '');
          safeSetText("Applicant-Zip Code", formData.sellerAddress.zip || '');
        }
        
 
        if (formData.sellerMailingAddressDifferent) {          
          if (formData.sellerMailingAddress) {
            safeSetText("Residence or organization address if different", formData.sellerMailingAddress.street || '');
            safeSetText("Apt/Space.2", formData.sellerMailingAddress.poBox || '');
            safeSetText("city2", formData.sellerMailingAddress.city || '');
            safeSetText("county2", formData.sellerMailingAddress.county || '');
            safeSetText("State2", formData.sellerMailingAddress.state || '');
            safeSetText("Zip Code2", formData.sellerMailingAddress.zip || '');
          }
        }
        
 
        try {
          const dobString = formData.sellerInfo?.sellers?.[0]?.dob || '';
          if (dobString) {
            console.log(`Processing seller DOB: ${dobString}`);
            
 
            const dobParts = dobString.split('/');
            
            if (dobParts.length === 3) {
              const month = dobParts[0].padStart(2, '0'); 
              const day = dobParts[1].padStart(2, '0'); 
              const year = dobParts[2]; 
              
 
              safeSetText("DOB-Mo1", month.charAt(0));
              safeSetText("DOB-Mo2", month.charAt(1));
              
 
              safeSetText("DOB-Day.1", day.charAt(0));
              safeSetText("DOB-Day.2", day.charAt(1));
              
 
              safeSetText("DOB-Yr.0", year.charAt(0));
              safeSetText("DOB-Yr.1.0", year.charAt(1));
              safeSetText("DOB-Yr.1.1", year.charAt(2));
              safeSetText("DOB-Yr.1.2", year.charAt(3));
              
              console.log(`Set DOB fields - Month: ${month}, Day: ${day}, Year: ${year}`);
            } else {
              console.warn(`Invalid DOB format: ${dobString}. Expected MM/DD/YYYY.`);
            }
          }
        } catch (error) {
          console.error('Error setting DOB fields:', error);
        }
        
 
        try {
          const phoneNumber = formData.sellerInfo?.sellers?.[0]?.phone || '';
          if (phoneNumber) {
 
            const cleanedPhone = phoneNumber.replace(/\D/g, '');
            
            if (cleanedPhone.length >= 3) {
 
              const areaCode = cleanedPhone.substring(0, 3);
 
              const mainNumber = cleanedPhone.substring(3);
              
 
              safeSetText("Area Code", areaCode);
              safeSetText("Daytime phone no", mainNumber);
              console.log(`Set phone fields - Area code: ${areaCode}, Main: ${mainNumber}`);
            }
          }
        } catch (error) {
          console.error('Error setting phone fields:', error);
        }
      } catch (error) {
        console.error('Error processing seller information:', error);
      }
    };

    const processDisabledPersonParkingInfo = async () => {
      try {
        if (formData.disabledPersonParkingInfo) {
          const parkingInfo = formData.disabledPersonParkingInfo;
          
 
          const placardType = parkingInfo.parkingPlacardType || '';
          
 
          safeSetCheckbox("Perm Park Placard.0", false);
          safeSetCheckbox("Perm Park Placard.1", false);
          safeSetCheckbox("Temp Park Placard.1", false);
          safeSetCheckbox("DP License plates", false);
          safeSetCheckbox("DP License plates reassignment", false);
          
 
          if (placardType.includes('Permanent DP Parking Placard')) {
            safeSetCheckbox("Perm Park Placard.1", true);
          } else if (placardType.includes('Temporary DP Parking Placard')) {
            safeSetCheckbox("Temp Park Placard.1", true);
          } else if (placardType.includes('Disabled Person License Plates (No Fee)')) {
            safeSetCheckbox("DP License plates", true);
          } else if (placardType.includes('Disabled Person License Plates Reassignment')) {
            safeSetCheckbox("DP License plates reassignment", true);
          } else if (placardType.includes('Travel Parking DP Parking Placard (No Fee)')) {
            safeSetCheckbox("Perm Park Placard.0", true);
          }
          
 
          const previousIssuance = parkingInfo.previousIssuance || '';
          
          try {
 
            if (previousIssuance === 'yes') {
 
              await drawXOnCheckbox("Yes No", 1, -39, -1); 
              
 
              try {
                await drawXOnCheckbox("Yes/No", 1, -39, -1);
              } catch (error) {
 
              }
              
              console.log('Drew X on checkbox to select YES option');
              
 
              if (parkingInfo.licensePlateNumber) {
                safeSetText("Lic Plate/Perm Placard", parkingInfo.licensePlateNumber);
              }
            } else {
 
              safeSetCheckbox("Yes No", true);
              
 
              try {
                safeSetCheckbox("Yes/No", true);
              } catch (error) {
 
              }
              
              console.log('Set checkbox to TRUE to select NO option');
            }
          } catch (error) {
            console.error('Error handling Yes/No selection:', error);
          }
        }
      } catch (error) {
        console.error('Error processing disabled person parking info:', error);
      }
    };

    const processDisabledPersonLicensePlates = async () => {
      try {
        if (formData.disabledPersonLicensePlates) {
          const plateInfo = formData.disabledPersonLicensePlates;
          
 
          safeSetText("Lic Plate no", plateInfo.licensePlateNumber || '');
          safeSetText("VIN", plateInfo.vehicleIdentificationNumber || '');
          safeSetText("Veh Make", plateInfo.vehicleMake || '');
          safeSetText("Veh Year", plateInfo.vehicleYear || '');
          
 
          if (plateInfo.weightFeeExemption === 'yes') {
 
            await drawXOnCheckbox("Yes/No", 0);
          } else if (plateInfo.weightFeeExemption === 'no') {
 
            safeSetCheckbox("Yes/No", true);
          }
        }
      } catch (error) {
        console.error('Error processing disabled person license plates info:', error);
      }
    };
    
 
    processSellerInfo();
    await processDisabledPersonParkingInfo();
    await processDisabledPersonLicensePlates();
    
 
    setCurrentDate();
    
    try {
      form.updateFieldAppearances();
    } catch (e) {
      console.warn('Error updating field appearances, continuing anyway:', e);
    }
    
    return await pdfDoc.save({
      useObjectStreams: false,
      addDefaultPage: false,
      updateFieldAppearances: false
    });
  } catch (error) {
    console.error('Error in modifyREG195Pdf:', error);
    
 
    const emptyPdf = await PDFDocument.create();
    return await emptyPdf.save();
  }
}

async function modifyDMVReg166Pdf(fileBytes: ArrayBuffer, formData: any): Promise<Uint8Array> {
  try {
    const pdfDoc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
    

    if (!pdfDoc) {
      console.error('Failed to load PDF document');
      throw new Error('Failed to load PDF document');
    }
    
    const form = pdfDoc.getForm();
    

    if (!form) {
      console.error('Failed to get form from PDF');
      throw new Error('Failed to get form from PDF');
    }
    
    try {
      const fieldNames = form.getFields().map(f => f.getName());
      console.log('Available DMVReg166 PDF Fields:', JSON.stringify(fieldNames, null, 2));
    } catch (error) {
      console.error('Error getting field names:', error);

    }
    
    console.log('===== COMPLETE FORM DATA =====');
    console.log(JSON.stringify(formData, null, 2));
    console.log('=============================');
    

    const fieldMapping = {

      "Year Model": "vehicleInformation.year",
      "Lic Plate/CF No": "vehicleInformation.licensePlate",
      "Veh/Ves ID No": "vehicleInformation.hullId",
      "Make/Builder": "vehicleInformation.make",
      

      "Name Bank, Finance Co": "releaseInformation.name",
      "Business/Res Address": "releaseInformation.address.street",
      "Apt/Sp/Ste No.0": "releaseInformation.address.apt",
      "City.0": "releaseInformation.address.city",
      "state.0": "releaseInformation.address.state",
      "Zip Code.0": "releaseInformation.address.zip",
      

      "Mailing address": "releaseInformation.mailingAddress.street",
      "Apt/Sp/Ste No.1": "releaseInformation.mailingAddress.poBox",
      "City.1": "releaseInformation.mailingAddress.city",
      "state.1": "releaseInformation.mailingAddress.state",
      "Zip Code.1": "releaseInformation.mailingAddress.zip",
      

      "Title of Agent": "releaseInformation.authorizedAgentTitle",
      "Printed Name": "releaseInformation.authorizedAgentName",
      "Date": "sellerInfo.sellers.0.saleDate", 
      

      "Reg Onwer-Last Name": "sellerInfo.sellers.0.lastName",
      "Reg Onwer-First Name": "sellerInfo.sellers.0.firstName",
      "Reg Onwer-Middle Name": "sellerInfo.sellers.0.middleName"
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
    

    const getNestedProperty = (obj: any, path: string): any => {
      if (!obj || !path) return undefined;
      
      const parts = path.split('.');
      let current = obj;
      
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        
        if (part.match(/^\d+$/) && Array.isArray(current)) {
          const index = parseInt(part);
          current = current[index];
        } else {
          current = current[part];
        }
        
        if (current === undefined || current === null) {
          return undefined;
        }
      }
      
      return current;
    };
    

    for (const [pdfField, formField] of Object.entries(fieldMapping)) {
      try {
        const value = getNestedProperty(formData, formField) || '';
        console.log(`Setting field ${pdfField} to value: "${value}" from path: ${formField}`);
        safeSetText(pdfField, String(value));
      } catch (error) {
        console.error(`Error applying mapping for field ${pdfField}:`, error);
      }
    }
    

    try {
      const phoneNumber = getNestedProperty(formData, "releaseInformation.phoneNumber") || '';
      if (phoneNumber) {

        const cleanedPhone = phoneNumber.replace(/\D/g, '');
        

        if (cleanedPhone.length >= 3) {
          const areaCode = cleanedPhone.substring(0, 3);
          const mainNumber = cleanedPhone.substring(3);
          
          safeSetText("area code", areaCode);
          safeSetText("Daytime Phone No", mainNumber);
          console.log(`Set phone fields - Area code: ${areaCode}, Main: ${mainNumber}`);
        }
      }
    } catch (error) {
      console.error('Error setting phone fields:', error);
    }
    

 
    const dateField = getNestedProperty(formData, "sellerInfo.sellers.0.saleDate");
    if (!dateField) {
      const currentDate = new Date();
      const formattedDate = `${String(currentDate.getMonth() + 1).padStart(2, '0')}/${String(currentDate.getDate()).padStart(2, '0')}/${currentDate.getFullYear()}`;
      console.log('Using current date as fallback:', formattedDate);
      
      try {
        safeSetText("Date", formattedDate);
      } catch (error) {
        console.warn('Could not set Date field:', error);
      }
    }
    

    try {

      try {
        form.updateFieldAppearances();
      } catch (e) {
        console.warn('Error updating field appearances, continuing anyway:', e);
      }
      
      return await pdfDoc.save({
        useObjectStreams: false,
        addDefaultPage: false,
        updateFieldAppearances: false
      });
    } catch (error: any) {
      console.error('Error saving PDF:', error);
      throw new Error('Failed to save PDF: ' + error.message);
    }
  } catch (error) {
    console.error('Error in modifyDMVReg166Pdf:', error);
    

    const emptyPdf = await PDFDocument.create();
    return await emptyPdf.save();
  }
}



async function modifyReg227Pdf(fileBytes: ArrayBuffer, formData: any, transactionType: any): Promise<Uint8Array> {
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
    
    seller1PhoneArea: 'area',
    seller1PhoneMain: '4 Daytime Phone Number 1',
    seller2PhoneArea: 'area23',
    seller2PhoneMain: '4 Daytime Phone Number 2.0',
    
    newOwner1Name: 'true full name of new owner, last, first, middle, suffix, business name, or lessor',
    newOwner2Name: '6 Name First-1',
    newOwner3Name: '6 Name Last-2',
    
    legalOwnerName: 'Name of bank, finance company, or individual having a lien on this vehicle',
    legalOwnerAddress: '2 Address',
    legalOwnerApt: '2 Apt/Space Number',
    legalOwnerCity: '2 City',
    legalOwnerState: '2 States1',
    legalOwnerZip: '2 Zip Code',
    
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
    
    owner1PhoneArea: '6 area code 1',
    owner1PhoneMain: 'daytime telephone number',
    owner2PhoneArea: 'area code 2',
    owner2PhoneMain: 'daytime number 2',
    owner3PhoneArea: 'area code 3',
    owner3PhoneMain: 'daytime number 3',
    
    owner1Date: 'date.0',
    owner2Date: "4 Date-2",
    
    owner1DateField1: "date.123", 
    owner2DateField: 'date 2',   
    owner3DateField: 'date 3',  
    
    purchaseDateMonth: "6 Purchase Price/Market Value",  
    purchaseDateDay: "Date Purchased",  
    acquiredYearField: "Acquired Yr",  
    
    purchasePriceField: "Purchase price",
    marketValueField: "market value", 
    
    seller1Address: '1 Residence or Business Address.0',
    seller1Apt: '1 Apt/Space Number-1',
    seller1City: '1 City-1',
    seller1StateField: '1 States1',
    seller1Zip: '1 Zip Code-1',
    
    sellerMailingAddress: '1 Mailing Address',
    sellerMailingApt: '1 Apt/Space Number-2',
    sellerMailingCity: '1 City-2',
    sellerMailingState: '1 States2',
    sellerMailingZip: '1 Zip Code-2.0',
    
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
    
    lienHolderName: '7 Name New Legal Owner',
    lienHolderAddress: 'Physical residence or business address.0',
    lienHolderApt: '7 Apt/Space Number.0',
    lienHolderCity: '7 City.0',
    lienHolderState: '7 State.0',
    lienHolderZip: '7 Zip Code.0',
    lienHolderElt: [
      '7 ELT #.0',
      '7 ELT #.1.0',
      '7 ELT #.1.1',
    ],

    lienHolderMailingAddress: 'mailing address',
    lienHolderMailingApt: '7 Apt/Space Number.1',
    lienHolderMailingCity: '7 City.1',
    lienHolderMailingState: '7 State.1',
    lienHolderMailingZip: '7 Zip Code.1',
    
    vehicleLicensePlate2: 'License Plate/CF Number122',
    vehicleHullId2: 'Vehicle/Vessel ID/Number211',
    vehicleYear2: 'Year/Make2',
    
    vehicleLicensePlate1: 'License Plate/CF Number1',
    vehicleHullId1: 'Vehicle/Vessel ID/Number1',
    vehicleYear1: 'Year/Make',
    appForCheckbox: "App for",
    appFor2Checkbox: 'App for2',
    
    giftCheckbox: 'Gift Box',
    tradeCheckbox: 'Gift Box1',
    
    countyField: 'county.0.0',
    
    owner2AndCheckbox: 'And Box.0',
    owner2OrCheckbox: 'And Box.1',
    owner3AndCheckbox: 'And Box1.0',
    owner3OrCheckbox: 'And Box1.1',

    lostCheckbox: "Check Box1",
    stolenCheckbox: "Check Box2",
    mutilatedCheckbox: "Check Box6",
    notReceivedFromOwnerCheckbox: "Check Box4",
    notReceivedFromDmvCheckbox: "Check Box5",

    sellerNamePrint: '3 Print Name Legal Owner.0',
    sellerPhoneArea: 'area code.0',
    sellerPhoneMain: '3 Daytime Phone Number',
    sellerDate: '3 Date.0'
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
  
  const formatPhone = (phoneNumber: string) => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    if (cleaned.length < 3) {
      return { areaCode: '', mainNumber: '' };
    }
    
    const areaCode = cleaned.substring(0, 3);
    const mainNumber = cleaned.substring(3);
    
    return { areaCode, mainNumber };
  };
  
  const sellerInfo = formData.sellerInfo || {};
  const seller1 = sellerInfo.sellers?.[0] || {};
  const seller2 = sellerInfo.sellers?.[1] || {};
  
  const owners = formData.owners || [];
  const owner1 = owners[0] || {};
  const owner2 = owners[1] || {};
  const owner3 = owners[2] || {};
  
  const owner2Exists = Object.keys(owner2).length > 0 && 
                     (owner2.firstName || owner2.lastName || owner2.licenseNumber);
  const owner3Exists = Object.keys(owner3).length > 0 && 
                     (owner3.firstName || owner3.lastName || owner3.licenseNumber);
  
  const addressData = formData.address || {};
  const mailingAddressData = formData.mailingAddress || {};
  const lesseeAddressData = formData.lesseeAddress || {};
  const trailerLocationData = formData.trailerLocation || {};
  const mailingAddressDifferent = formData.mailingAddressDifferent || false;
  const lesseeAddressDifferent = formData.lesseeAddressDifferent || false;
  const trailerLocationDifferent = formData.trailerLocationDifferent || false;
  
  const sellerAddress = formData.sellerAddress || seller1.address || {};
  const sellerMailingAddress = formData.sellerMailingAddress || {};
  const lienHolder = formData.lienHolder || {};
  const lienHolderAddress = lienHolder.address || {};
  
  const legalOwnerInfo = formData.legalOwnerInformation || {};
  const legalOwnerAddress = legalOwnerInfo.address || {};
  
  const vehicleInfo = formData.vehicleInformation || {};
  
  const county = formData.trailerLocation?.county || addressData.county || '';
  
  const formatSellerName = (seller: any) => {
    return [
      seller.lastName?.trim() || '',
      seller.middleName?.trim() || '',
      seller.firstName?.trim() || ''
    ].filter(Boolean).join(', ');
  };
  
  const formatOwnerNamePrint = (owner: any) => {
    return [
     
      owner.lastName?.trim() || '',
      owner.firstName?.trim() || '',
      owner.middleName?.trim() || '',
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
    safeSetText(fieldMapping.sellerNamePrint, formatOwnerNamePrint(seller1));
    if (seller1.phone) {
      const { areaCode, mainNumber } = formatPhone(seller1.phone);
      safeSetText(fieldMapping.sellerPhoneArea, areaCode);
      safeSetText(fieldMapping.sellerPhoneMain, mainNumber);
    }
    
    const sellerDate = seller1.saleDate || '';
    if (sellerDate) {
      safeSetText(fieldMapping.sellerDate, formatDate(sellerDate));
    }
    
    if (seller1.licenseNumber) {
      fillCharacterFields(fieldMapping.seller1License, seller1.licenseNumber);
    }
    
    if (seller1.isGift) {
      safeSetCheckbox(fieldMapping.giftCheckbox, true);
    }
    if (seller1.isTrade) {
      safeSetCheckbox(fieldMapping.tradeCheckbox, true);
    }
    
    if (seller1.phone) {
      const { areaCode, mainNumber } = formatPhone(seller1.phone);
      safeSetText(fieldMapping.seller1PhoneArea, areaCode);
      safeSetText(fieldMapping.seller1PhoneMain, mainNumber);
    }
  }
  
  if (Object.keys(seller2).length > 0) {
    safeSetText(fieldMapping.seller2Name, formatSellerName(seller2));
    safeSetText(fieldMapping.seller2NamePrint, formatOwnerNamePrint(seller2));
    safeSetText(fieldMapping.seller2State, seller2.state || '');
    
    if (seller2.licenseNumber) {
      fillCharacterFields(fieldMapping.seller2License, seller2.licenseNumber);
    }
    
    if (seller2.phone) {
      const { areaCode, mainNumber } = formatPhone(seller2.phone);
      safeSetText(fieldMapping.seller2PhoneArea, areaCode);
      safeSetText(fieldMapping.seller2PhoneMain, mainNumber);
    }
  }
  
  if (Object.keys(owner1).length > 0) {
    safeSetText(fieldMapping.newOwner1Name, formatOwnerNamePrint(owner1));
    
    safeSetText(fieldMapping.newOwner1State, owner1.state || '');
    
    if (owner1.licenseNumber) {
      fillCharacterFields(fieldMapping.newOwner1License, owner1.licenseNumber);
    }
    
    if (owner1.phoneNumber) {
      const { areaCode, mainNumber } = formatPhone(owner1.phoneNumber);
      safeSetText(fieldMapping.owner1PhoneArea, areaCode);
      safeSetText(fieldMapping.owner1PhoneMain, mainNumber);
    }

    const isGift = formData.vehicleTransactionDetails?.isGift === true;

    
    if (isGift) {
      safeSetCheckbox(fieldMapping.giftCheckbox, true);
    }
    if (!seller1.isTrade && owner1.isTrade) {
      safeSetCheckbox(fieldMapping.tradeCheckbox, true);
    }
  }
  
  if (owner2Exists) {
    safeSetText(fieldMapping.newOwner2Name, formatOwnerNamePrint(owner2));
    safeSetText(fieldMapping.newOwner2State, owner2.state || '');
    
    if (owner2.licenseNumber) {
      fillCharacterFields(fieldMapping.newOwner2License, owner2.licenseNumber);
    }
    
    if (owner2.phoneNumber) {
      const { areaCode, mainNumber } = formatPhone(owner2.phoneNumber);
      safeSetText(fieldMapping.owner2PhoneArea, areaCode);
      safeSetText(fieldMapping.owner2PhoneMain, mainNumber);
    }
    
    if (owner2.relationshipType === 'AND') {
      safeSetCheckbox(fieldMapping.owner2AndCheckbox, true);
    } else if (owner2.relationshipType === 'OR') {
      safeSetCheckbox(fieldMapping.owner3AndCheckbox, true);
    }
  }
  
  if (owner3Exists) {
    safeSetText(fieldMapping.newOwner3Name, formatOwnerNamePrint(owner3));
    safeSetText(fieldMapping.newOwner3State, owner3.state || '');
    
    if (owner3.licenseNumber) {
      fillCharacterFields(fieldMapping.newOwner3License, owner3.licenseNumber);
    }
    
    if (owner3.phoneNumber) {
      const { areaCode, mainNumber } = formatPhone(owner3.phoneNumber);
      safeSetText(fieldMapping.owner3PhoneArea, areaCode);
      safeSetText(fieldMapping.owner3PhoneMain, mainNumber);
    }
    
    if (owner3.relationshipType === 'AND') {
      safeSetCheckbox(fieldMapping.owner2OrCheckbox, true);
    } else if (owner3.relationshipType === 'OR') {
      safeSetCheckbox(fieldMapping.owner3OrCheckbox, true);
    }
  }

  if (formData.missingTitleInfo && formData.missingTitleInfo.reason) {
    const reason = formData.missingTitleInfo.reason;
    
    switch(reason) {
      case 'Lost':
        safeSetCheckbox(fieldMapping.lostCheckbox, true);
        console.log("it is lostttt");
        break;
      case 'Stolen':
        safeSetCheckbox(fieldMapping.stolenCheckbox, true);
        break;
      case 'Illegible/Mutilated (Attach old title)':
        safeSetCheckbox(fieldMapping.mutilatedCheckbox, true);
        break;
      case 'Not Received From Prior Owner':
        safeSetCheckbox(fieldMapping.notReceivedFromOwnerCheckbox, true);
        break;
      case 'Not Received From DMV (Allow 30 days from issue date)':
        safeSetCheckbox(fieldMapping.notReceivedFromDmvCheckbox, true);
        break;
      case 'Other':
        break;
    }
  }
  
  if (Object.keys(legalOwnerInfo).length > 0) {
    safeSetText(fieldMapping.legalOwnerName, legalOwnerInfo.name || '');
    safeSetText(fieldMapping.legalOwnerAddress, legalOwnerAddress.street || '');
    safeSetText(fieldMapping.legalOwnerApt, legalOwnerAddress.apt || '');
    safeSetText(fieldMapping.legalOwnerCity, legalOwnerAddress.city || '');
    safeSetText(fieldMapping.legalOwnerState, legalOwnerAddress.state || '');
    safeSetText(fieldMapping.legalOwnerZip, legalOwnerAddress.zip || '');
  } 
  else {
    safeSetText(fieldMapping.legalOwnerName, 'NONE');
  }
  
  safeSetText(fieldMapping.seller1Address, sellerAddress.street || '');
  safeSetText(fieldMapping.seller1Apt, sellerAddress.apt || '');
  safeSetText(fieldMapping.seller1City, sellerAddress.city || '');
  safeSetText(fieldMapping.seller1StateField, sellerAddress.state || '');
  safeSetText(fieldMapping.seller1Zip, sellerAddress.zip || '');
  
  if (Object.keys(sellerMailingAddress).length > 0) {
    safeSetText(fieldMapping.sellerMailingAddress, sellerMailingAddress.street || '');
    safeSetText(fieldMapping.sellerMailingApt, sellerMailingAddress.poBox || sellerMailingAddress.apt || '');
    safeSetText(fieldMapping.sellerMailingCity, sellerMailingAddress.city || '');
    safeSetText(fieldMapping.sellerMailingState, sellerMailingAddress.state || '');
    safeSetText(fieldMapping.sellerMailingZip, sellerMailingAddress.zip || '');
  }
  
  safeSetText(fieldMapping.newAddress, addressData.street || '');
  safeSetText(fieldMapping.newAddressApt, addressData.apt || '');
  safeSetText(fieldMapping.newAddressCity, addressData.city || '');
  safeSetText(fieldMapping.newAddressState, addressData.state || '');
  safeSetText(fieldMapping.newAddressZip, addressData.zip || '');
  
  safeSetText(fieldMapping.countyField, county);
  
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
    safeSetText(fieldMapping.trailerAddressDescription, trailerLocationFormatted);
  }
  
 
  const purchaseDate = seller1.saleDate || '';
  const formattedDate = formatDate(purchaseDate);
  
  const dateComponents = extractDateComponents(purchaseDate);
  
  if (purchaseDate) {
 
    safeSetText(fieldMapping.owner1Date, formattedDate);
    safeSetText(fieldMapping.owner1DateField1, formattedDate);
    safeSetText(fieldMapping.owner2Date, formattedDate);
    safeSetText(fieldMapping.owner2DateField, formattedDate);
    safeSetText(fieldMapping.owner3DateField, formattedDate);
    safeSetText(fieldMapping.sellerDate, formattedDate);
    
    safeSetText(fieldMapping.purchaseDateMonth, dateComponents.month); 
    safeSetText(fieldMapping.purchaseDateDay, dateComponents.day);
    safeSetText(fieldMapping.acquiredYearField, dateComponents.year);
  }
  
  const purchaseValue = owner1.purchaseValue || '';
  
  const hasMarketValue = formData.marketValue || owner1.marketValue;
  
 
  
 
 
 
 
  
  if(hasMarketValue) {
    safeSetText(fieldMapping.marketValueField, hasMarketValue);
    safeSetText(fieldMapping.purchasePriceField, '');
  } else {
    safeSetText(fieldMapping.purchasePriceField, purchaseValue);
    safeSetText(fieldMapping.marketValueField, '');
  }
  
  if (Object.keys(lienHolder).length > 0 && lienHolder.name) {
    safeSetText(fieldMapping.lienHolderName, lienHolder.name);
    safeSetText(fieldMapping.lienHolderAddress, lienHolderAddress.street || '');
    safeSetText(fieldMapping.lienHolderApt, lienHolderAddress.apt || '');
    safeSetText(fieldMapping.lienHolderCity, lienHolderAddress.city || '');
    safeSetText(fieldMapping.lienHolderState, lienHolderAddress.state || '');
    safeSetText(fieldMapping.lienHolderZip, lienHolderAddress.zip || '');

    if (lienHolder.eltNumber) {
      const eltDigits = lienHolder.eltNumber.replace(/\D/g, '').slice(0, 3);
      fillCharacterFields(fieldMapping.lienHolderElt, eltDigits);
    }

    if (lienHolder.mailingAddress) {
      safeSetText(fieldMapping.lienHolderMailingAddress, lienHolder.mailingAddress.street || '');
      safeSetText(fieldMapping.lienHolderMailingApt, lienHolder.mailingAddress.poBox || '');
      safeSetText(fieldMapping.lienHolderMailingCity, lienHolder.mailingAddress.city || '');
      safeSetText(fieldMapping.lienHolderMailingState, lienHolder.mailingAddress.state || '');
      safeSetText(fieldMapping.lienHolderMailingZip, lienHolder.mailingAddress.zip || '');
    }
  }
  else {
    safeSetText(fieldMapping.lienHolderName, 'NONE');
  } 
  
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

  console.log('Transaction Type:', formData.transactionType);
  
  if (transactionType === "Lien Holder Removal" || 
    transactionType === "Lien Holder Addition" || 
    transactionType === "Duplicate Title Transfer") {
  console.log('Setting checkbox for App for');
  safeSetCheckbox(fieldMapping.appForCheckbox, true);
} else {
  console.log('Setting checkbox for App for2');
  safeSetCheckbox(fieldMapping.appFor2Checkbox, true);
}


  form.updateFieldAppearances();
  pdfDoc.catalog.set(PDFName.of('NeedAppearances'), PDFBool.True);
  
  return await pdfDoc.save();
}



async function modifyDMVREG262Pdf(fileBytes: ArrayBuffer, formData: any): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
  const form = pdfDoc.getForm();
  const fieldNames = form.getFields().map(f => f.getName());
  console.log('Available Reg262 PDF Fields:', JSON.stringify(fieldNames, null, 2));
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

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
  
  try {
    const checkbox = form.getCheckBox('Group1');
    if (checkbox) {
      const shouldCheck = !!formData.vehicleInformation.exceedsMechanicalLimit;
      console.log('Setting checkbox state for Group1:', shouldCheck);
      
      if (shouldCheck) {
        checkbox.isChecked();
      } else {
        checkbox.uncheck();
      }
      
      console.log('Successfully set checkbox state for Group1');
    } else {
      console.warn('Group1 field not found, falling back to drawing method');
    }
  } catch (error) {
    console.error('Error setting checkbox:', error);
  }
  
  console.log("Drawing text directly on the PDF...");
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
 
  const sellerInfo = formData.sellerInfo || {};
  const sellers = sellerInfo.sellers || [];
  let dateText = '';
  
  if (sellers && sellers.length > 0 && sellers[0].saleDate) {
    const purchaseDate = new Date(sellers[0].saleDate);
    
    if (!isNaN(purchaseDate.getTime())) {
      const month = String(purchaseDate.getMonth() + 1).padStart(2, '0'); 
      const day = String(purchaseDate.getDate()).padStart(2, '0');
      const year = String(purchaseDate.getFullYear());
      
      console.log(`Formatting date: ${month}/${day}/${year}`);
      
 
      firstPage.drawText(month[0], {
        x: 310, 
        y: 603, 
        size: 12,
        font: font,
        color: rgb(0, 0, 0),
      });
      
      firstPage.drawText(month[1], {
        x: 315, 
        y: 603, 
        size: 12,
        font: font,
        color: rgb(0, 0, 0),
      });
      
 
      firstPage.drawText(day[0], {
        x: 330, 
        y: 603, 
        size: 12,
        font: font,
        color: rgb(0, 0, 0),
      });
      
      firstPage.drawText(day[1], {
        x: 336, 
        y: 603, 
        size: 12,
        font: font,
        color: rgb(0, 0, 0),
      });
      
 
      for (let i = 0; i < year.length; i++) {
        firstPage.drawText(year[i], {
          x: 350 + (i * 12), 
          y: 603, 
          size: 12,
          font: font,
          color: rgb(0, 0, 0),
        });
      }
      
      dateText = `${month}/${day}/${year}`;
    } else {
      console.warn('Invalid purchase date format:', sellers[0].saleDate);
    }
  } else {
    console.warn('No purchase date found for owner');
  }
  
 
  const vehicleInfo = formData.vehicleInformation || {};
  const mileage = vehicleInfo.mileage || '';
  
  if (mileage) {
    const mileageString = mileage.toString().padStart(6, '0');
    
    for (let i = 0; i < 6; i++) {
      const xPositions = [160, 185, 210, 250, 275, 300]; 
      const y = 486;
      
      if (i < mileageString.length) {
        firstPage.drawText(mileageString[i], {
          x: xPositions[i],
          y: y,
          size: 12,
          font: font,
          color: rgb(0, 0, 0),
        });
      }
    }
  }
  
  const textPositions = {
    'IDENTIFICATION NUMBER': { x: 100, y: 665 },
    'YEAR MODEL': { x: 245, y: 665 },
    'MAKE': { x: 300, y: 665 },
    'LICENSE PLATE/CF NO': { x: 350, y: 665 },
    'MOTORCYCLE ENGINE NUMBER': { x: 475, y: 665 },
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
    'APPOINTER' : { x: 75, y: 105 },
    'APPOINTEE': { x: 435, y: 105 },
    'POA DATE 1': { x: 435, y: 60 },
    'POA DATE 2': { x: 435, y: 37 },
  };

  const powerOfAttorneyData = formData.powerOfAttorney || {};

  const formatFullName = (person: any) => {
    if (!person) return '';
    return [person.firstName, person.middleName, person.lastName].filter(Boolean).join(' ');
  };
  
  const formatAddress = (address: any) => {
    if (!address) return '';
    
    console.log("Formatting address:", JSON.stringify(address));
    
    const street = `${address.street}                           `|| '';
    const apt = address.apt ? `Apt/Space ${address.apt}` : '';
    const city = address.city ? `${address.city}                 ` : '';
    const state = `${address.state}                              ` || '';
    const zip = address.zip || '';
    
    const parts = [street, apt, city, state, zip].filter(Boolean);
    return parts.join(' ');
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
  
  const owners = formData.owners || [];
  
 
  const seller1SaleDate = sellers.length > 0 ? sellers[0].saleDate : '';
  
  const buyerMailingAddressDifferent = formData.mailingAddressDifferent || false;
  const buyerRegularAddress = formData.address || {};
  const buyerMailingAddress = buyerMailingAddressDifferent ? 
                            (formData.mailingAddress || {}) : 
                            buyerRegularAddress;
  
  console.log("Buyer mailing address different?", buyerMailingAddressDifferent);
  console.log("Buyer regular address:", JSON.stringify(buyerRegularAddress));
  console.log("Buyer mailing address:", JSON.stringify(buyerMailingAddress));

  const sellerMailingAddressDifferent = formData.sellerMailingAddressDifferent || false;
  const sellerRegularAddress = formData.sellerAddress || {};
  const sellerMailingAddress = sellerMailingAddressDifferent ? 
                               (formData.sellerMailingAddress || {}) : 
                               sellerRegularAddress;
                            
  console.log("Seller mailing address different?", sellerMailingAddressDifferent);
  console.log("Seller regular address:", JSON.stringify(sellerRegularAddress));
  console.log("Seller mailing address:", JSON.stringify(sellerMailingAddress));
  
  for (const [label, position] of Object.entries(textPositions)) {
    let value = '';
    
    if (label === 'IDENTIFICATION NUMBER') value = vehicleInfo.hullId || '';
    else if (label === 'YEAR MODEL') value = vehicleInfo.year || '';
    else if (label === 'MAKE') value = vehicleInfo.make || '';
    else if (label === 'LICENSE PLATE/CF NO') value = vehicleInfo.licensePlate || '';
    else if (label === 'MOTORCYCLE ENGINE NUMBER') value = vehicleInfo.engineNumber || '';
 
    else if (label === 'POA DATE 1') {
 
      if (sellerInfo && sellerInfo.sellers && sellerInfo.sellers.length > 0 && sellerInfo.sellers[0].saleDate) {
        value = sellerInfo.sellers[0].saleDate || '';
        console.log(`Found seller's sale date for POA DATE 1: ${value}`);
      } else {
        console.log('No seller sale date found for POA DATE 1, leaving empty');
        value = '';
      }
    }
    else if (label === 'POA DATE 2') {
 
      if (sellerInfo && sellerInfo.sellers && sellerInfo.sellers.length > 1 && sellerInfo.sellers[1].saleDate) {
        value = sellerInfo.sellers[1].saleDate || '';
        console.log(`Found second seller's sale date for POA DATE 2: ${value}`);
      } else {
        console.log('No second seller sale date found for POA DATE 2, leaving empty');
        value = '';
      }
    }
    if (powerOfAttorneyData.dates && powerOfAttorneyData.dates.length > 2) {
      console.warn(`Note: Power of Attorney has ${powerOfAttorneyData.dates.length} dates, but only the first 2 will be displayed on the form.`);
    }  
    else if (label === 'APPOINTER') {
      value = powerOfAttorneyData.printNames || '';
      console.log(`Found appointer value: ${value}`);
    }
    
    else if (label === 'APPOINTEE') {
      value = powerOfAttorneyData.appointee || '';
      console.log(`Found appointee value: ${value}`);
    }
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
    
 
    else if (label === 'BUYER 1 DOP' || label === 'BUYER 2 DOP' || label === 'BUYER 3 DOP' || 
             label === 'SELLER 1 DOP' || label === 'SELLER 2 DOP' || label === 'SELLER 3 DOP') {
      value = formatDate(seller1SaleDate);
      console.log(`Using seller1's sale date for ${label}: ${value}`);
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
      const addressToUse = buyerMailingAddressDifferent ? buyerMailingAddress : buyerRegularAddress;
      value = formatAddress(addressToUse);
      console.log(`Formatted buyer address: ${value}`);
    }
    
    else if (label === 'SELLER 1 ADDRESS') {
      if (sellerMailingAddressDifferent) {
        value = formatAddress(sellerMailingAddress);
        console.log(`Found seller 1 mailing address (different): ${value}`);
      } else {
        value = formatAddress(sellerRegularAddress);
        console.log(`Using seller regular address: ${value}`);
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
  
 
  if (vehicleInfo.notActualMileage) {
    firstPage.drawText('X', {
      x: 38,
      y: 442,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    });
  }
  
  if (vehicleInfo.exceedsMechanicalLimit) {
    firstPage.drawText('X', {
      x: 312,
      y: 442,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    });
  }
  
  return await pdfDoc.save();
}


async function modifyReg256Pdf(fileBytes: ArrayBuffer, formData: any): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
  
  const form = pdfDoc.getForm();
  const fieldNames = form.getFields().map(f => f.getName());
  console.log('Available Reg256 PDF Fields:', JSON.stringify(fieldNames, null, 2));
  
  const fieldMapping = {
    vehicleLicensePlate: 'License Plate/CF Number', 
    vehicleVin: 'Veh/Vessel ID Number', 
    vehicleYearMake: 'Year/Make2', 
    
    
    familyTransferBox: 'Family transfer box',
    giftBox: 'gift box', 
    
    currentMarketValue: 'Current Market Value 1',  
    
    ownerLastName: 'PRINTED NAME',
    ownerFirstName: 'FIRST NAME',
    ownerMiddleName: 'MIDDLE NAME',
    
    ownerPhoneAreaCode: 'App sign area code',
    ownerPhoneNumber: 'App sign phone no',
    
    signatureDate: 'Signature date',
    
    biennialSmogBox: 'Biennial Smog cert box',
    poweredByBox: 'Powered by box',
    poweredByElectricityBox: 'Powered by electricity box',
    poweredByDieselBox: 'Powered by diesel box',
    poweredByOtherBox: 'Powered by other box',
    poweredByOtherText: 'Powered by other 2',
    outsideCaliforniaBox: 'Paren, grandparent, etc box', 
    familyTransferRelationshipBox: 'Paren, grandparent, etc box',
    leasingCompanyBox: 'Companies leasing vehicle box',
    lessorLesseeBox: 'Lessor/Lessee of vehicle box',
    lessorOperatorBox: 'Lessor/lessee operator box',
    individualAddedBox: 'Individual(s) being added as registered owner(s).*',
    
 
    firstSamePerson: 'text_71uait',
    secondSamePerson: 'text_72rrpr',
    misspelledNameCorrection: 'text_73xplb',
    toName: 'text_74udmw',
    fromName: 'text_75ujtd',
    isSamePersonCheckbox: 'checkbox_76urox',
    isNameMisspelledCheckbox: 'checkbox_77lxng',
    isChangingNameCheckbox: 'checkbox_78tyvm'
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
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
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
  
  const formatPhone = (phoneNumber: string) => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    if (cleaned.length < 3) {
      return { areaCode: '', mainNumber: '' };
    }
    
    const areaCode = cleaned.substring(0, 3);
    const mainNumber = cleaned.substring(3);
    
    return { areaCode, mainNumber };
  };
  
 
  const processNameStatement = () => {
    try {
      if (formData.nameStatement) {
        const nameStatement = formData.nameStatement;
        console.log('Processing name statement data:', JSON.stringify(nameStatement, null, 2));
        
 
        if (nameStatement.isSamePerson) {
          safeSetCheckbox(fieldMapping.isSamePersonCheckbox, true);
          
          if (nameStatement.samePerson) {
            safeSetText(fieldMapping.firstSamePerson, nameStatement.samePerson.firstPerson || '');
            safeSetText(fieldMapping.secondSamePerson, nameStatement.samePerson.secondPerson || '');
          }
        } else {
          safeSetCheckbox(fieldMapping.isSamePersonCheckbox, false);
        }
        
 
        if (nameStatement.isNameMisspelled) {
          safeSetCheckbox(fieldMapping.isNameMisspelledCheckbox, true);
          safeSetText(fieldMapping.misspelledNameCorrection, nameStatement.misspelledNameCorrection || '');
        } else {
          safeSetCheckbox(fieldMapping.isNameMisspelledCheckbox, false);
        }
        
 
        if (nameStatement.isChangingName) {
          safeSetCheckbox(fieldMapping.isChangingNameCheckbox, true);
          
          if (nameStatement.nameChange) {
            safeSetText(fieldMapping.fromName, nameStatement.nameChange.fromName || '');
            safeSetText(fieldMapping.toName, nameStatement.nameChange.toName || '');
          }
        } else {
          safeSetCheckbox(fieldMapping.isChangingNameCheckbox, false);
        }
      }
    } catch (error) {
      console.error('Error processing name statement information:', error);
    }
  };

 
  const sellerInfo = formData.sellerInfo || {};
  const sellers = sellerInfo.sellers || [];
  const seller = sellers.length > 0 ? sellers[0] : null;
  const seller1SaleDate = seller?.saleDate || '';
  const formattedSeller1SaleDate = formatDate(seller1SaleDate);
  
  const ownerInfo = formData.ownerInfo || {};
  const owner = ownerInfo.owner || {};
  const vehicleInfo = formData.vehicleInformation || {};
  const addressData = formData.address || {};
  
 
  const owners = formData.owners || [];
  const newRegOwner = Array.isArray(owners) && owners.length > 0 ? owners[0] : null;
  
 
  const processPersonalInfo = () => {
    try {
 
      let lastName = '';
      let firstName = '';
      let middleName = '';
      let phoneNumber = '';
      
 
      if (newRegOwner) {
        console.log('Using owner data for personal information');
        lastName = newRegOwner.lastName || '';
        firstName = newRegOwner.firstName || '';
        middleName = newRegOwner.middleName || '';
        phoneNumber = newRegOwner.phoneNumber || '';
      } 
 
      else if (seller) {
        console.log('Falling back to seller data for personal information');
        lastName = seller.lastName || '';
        firstName = seller.firstName || '';
        middleName = seller.middleName || '';
        phoneNumber = seller.phone || '';
      }
      
 
      safeSetText(fieldMapping.ownerLastName, lastName);
      safeSetText(fieldMapping.ownerFirstName, firstName);
      safeSetText(fieldMapping.ownerMiddleName, middleName);
      
 
      const { areaCode, mainNumber } = formatPhone(phoneNumber);
      safeSetText(fieldMapping.ownerPhoneAreaCode, areaCode);
      safeSetText(fieldMapping.ownerPhoneNumber, mainNumber);
      
      console.log(`Set personal info - Name: ${firstName} ${middleName} ${lastName}, Phone: ${phoneNumber}`);
    } catch (error) {
      console.error('Error processing personal information:', error);
    }
  };
  
  const isGift = formData.vehicleTransactionDetails?.isGift === true;
  const isFamilyTransfer = formData.vehicleTransactionDetails?.isFamilyTransfer === true;
  const isSmogExempt = formData.vehicleTransactionDetails?.isSmogExempt === true;
  
  console.log(`Transaction type: ${isGift ? 'Gift' : isFamilyTransfer ? 'Family Transfer' : isSmogExempt ? 'Smog Exempt' : 'Other'}`);
  
 
  processPersonalInfo();
  
 
  if (isGift && newRegOwner?.marketValue) {
    safeSetText(fieldMapping.currentMarketValue, newRegOwner.marketValue.toString());
    console.log(`Set market value to: ${newRegOwner.marketValue}`);
  }
  
  safeSetText(fieldMapping.vehicleLicensePlate, vehicleInfo.licensePlate || '');
  safeSetText(fieldMapping.vehicleVin, vehicleInfo.vin || vehicleInfo.hullId || '');
  
  const yearMakeValue = [vehicleInfo.year || '', vehicleInfo.make || ''].filter(Boolean).join(' ');
  safeSetText(fieldMapping.vehicleYearMake, yearMakeValue);
  
  if (isGift) {
    safeSetCheckbox(fieldMapping.giftBox, true);
    safeSetCheckbox(fieldMapping.familyTransferBox, false);
    console.log('Gift box checked');
  } else if (isFamilyTransfer) {
    safeSetCheckbox(fieldMapping.familyTransferBox, true);
    safeSetCheckbox(fieldMapping.giftBox, false);
    console.log('Family transfer box checked');
  }
  
  if (isSmogExempt && formData.smogExemption) {
    const smogData = formData.smogExemption;
    const exemptionReasons = smogData.exemptionReasons || {};
    console.log('Processing smog exemption data:', JSON.stringify(exemptionReasons));
    
    safeSetCheckbox(fieldMapping.biennialSmogBox, exemptionReasons.lastSmogCertification || false);
    
    if (exemptionReasons.alternativeFuel) {
      safeSetCheckbox(fieldMapping.poweredByBox, true);
      
      const powerSource = smogData.powerSource || {};
      safeSetCheckbox(fieldMapping.poweredByElectricityBox, powerSource.electricity || false);
      safeSetCheckbox(fieldMapping.poweredByDieselBox, powerSource.diesel || false);
      
      if (powerSource.other) {
        safeSetCheckbox(fieldMapping.poweredByOtherBox, true);
        safeSetText(fieldMapping.poweredByOtherText, smogData.powerSourceOther || '');
      }
    }
    
    safeSetCheckbox(fieldMapping.outsideCaliforniaBox, exemptionReasons.outsideCalifornia || false);
    
    if (exemptionReasons.familyTransfer) {
      safeSetCheckbox(fieldMapping.familyTransferRelationshipBox, true);
    }
    
    safeSetCheckbox(fieldMapping.leasingCompanyBox, exemptionReasons.leasingCompany || false);
    safeSetCheckbox(fieldMapping.lessorLesseeBox, exemptionReasons.lessorLessee || false);
    safeSetCheckbox(fieldMapping.lessorOperatorBox, exemptionReasons.lessorOperator || false);
    
    if (fieldMapping.individualAddedBox) {
      safeSetCheckbox(fieldMapping.individualAddedBox, exemptionReasons.addingOwners || false);
    }
  }
  
 
  processNameStatement();
  
 
  const currentDate = new Date();
  const formattedCurrentDate = currentDate.toLocaleDateString('en-US', { 
    month: '2-digit', 
    day: '2-digit', 
    year: 'numeric' 
  }).replace(/\//g, '/');
  
  safeSetText(fieldMapping.signatureDate, formattedCurrentDate);
  console.log(`Set signature date to current date: ${formattedCurrentDate}`);
  
  form.updateFieldAppearances();
  pdfDoc.catalog.set(PDFName.of('NeedAppearances'), PDFBool.True);
  
  return await pdfDoc.save();
}

async function modifyReg101Pdf(fileBytes: ArrayBuffer, formData: any): Promise<Uint8Array> {
 
  const pdfDoc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
  
  const form = pdfDoc.getForm();
  
  const fieldNames = form.getFields().map(f => f.getName());
  console.log('Available Reg101 PDF Fields:', JSON.stringify(fieldNames, null, 2));
  
  console.log('===== COMPLETE FORM DATA =====');
  console.log(JSON.stringify(formData, null, 2));
  console.log('=============================');
  
  const fieldMapping = {
    licensePlate: "vehicle license plate or vessel CF Number",
    hullId: "vehicle/hull id number",
    make: "make",
    newOwner1Name: "last, first and middle name.0",
    newOwner2Name: "last, first and middle name.1",
    newOwner3Name: "last, first and middle name.2",
    
    newOwner1License: [
      "CA DL or ID number.0.0.0",
      "CA DL or ID number.0.0.1",
      "CA DL or ID number.0.0.2",
      "CA DL or ID number.0.1.0",
      "CA DL or ID number.0.1.1",
      "CA DL or ID number.0.1.2",
      "CA DL or ID number.0.2.0",
      "CA DL or ID number.0.2.1"
    ],
    
    newOwner2License: [
      "CA DL or ID number.0.2.2",
      "CA DL or ID number.0.3.0",
      "CA DL or ID number.0.3.1",
      "CA DL or ID number.0.3.2",
      "CA DL or ID number.0.4.0",
      "CA DL or ID number.0.4.1",
      "CA DL or ID number.0.4.2",
      "CA DL or ID number.0.5.0"
    ],
    
    newOwner3License: [
      "CA DL or ID number.0.5.1",
      "CA DL or ID number.0.5.2",
      "CA DL or ID number.0.6.0",
      "CA DL or ID number.0.6.1",
      "CA DL or ID number.0.6.2",
      "CA DL or ID number.0.7.0",
      "CA DL or ID number.0.7.1",
      "CA DL or ID number.0.7.2"
    ],
    
    purchaseDate: "purchase date",
    purchasePrice: "purchase price",
    regOwnerAddress: "reg owner address",
    regOwnerCity: "reg owner city",
    regOwnerState: "reg owner state",
    regOwnerZip: "reg owner zip",
    regOwnerAndOr: "reg owner and/or",
    regOwnerAndOr2: "reg owner and/or 2",
    regOwnerAndOr3: "reg owner and/or3",
    regOwnerAndOr4: "reg owner and/or4",
    
    leaseVehicleOnly: "lease vehicle only",
    vesselsOnly: "vessels only",
    
    lienHolderName: "lien holder",
    lienHolderAddress: "lien holder address",
    lienHolderCity: "lien holder city",
    lienHolderState: "lien holder state",
    lienHolderZip: "lien holder zip",

    leasevehicleonly:  "lease vehicle only",
    vesselsonly:   "vessels only",
    lienHolderAddress2: "lien holder address2",
    lienHolderCity2: "lien holder city2", 
    lienHolderState2: "lien holder state2",
    lienHolderZip2: "lien holder zip2",
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

  const safeSetCheckBox = (fieldName: string, value: boolean) => {
    try {
      const checkBox = form.getCheckBox(fieldName);
      if (checkBox) {
        if (value) {
          checkBox.check();
        } else {
          checkBox.uncheck();
        }
        console.log(`Successfully set checkbox: ${fieldName} to ${value}`);
      } else {
        console.warn(`Checkbox not found: ${fieldName}`);
      }
    } catch (error) {
      console.error(`Error setting checkbox ${fieldName}:`, error);
    }
  };

  const safeSetRadioGroup = (fieldName: string, value: string) => {
    try {
      const radioGroup = form.getRadioGroup(fieldName);
      if (radioGroup) {
        const options = radioGroup.getOptions();
        console.log(`Radio group options for ${fieldName}:`, options);
        
        const normalizedValue = value.toLowerCase();
        
        if (options.includes(normalizedValue)) {
          radioGroup.select(normalizedValue);
          console.log(`Successfully selected radio option ${normalizedValue} for ${fieldName}`);
        } else {
          console.warn(`Invalid option ${value} for radio group ${fieldName}. Available options: ${options.join(', ')}`);
        }
      } else {
        console.warn(`Radio group not found: ${fieldName}`);
      }
    } catch (error) {
      console.error(`Error setting radio group ${fieldName}:`, error);
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
  
 
  let seller1SaleDate = '';
  if (formData.sellerInfo && formData.sellerInfo.sellers && formData.sellerInfo.sellers.length > 0) {
    seller1SaleDate = formData.sellerInfo.sellers[0].saleDate || '';
    console.log("Found seller1's sale date:", seller1SaleDate);
  }

 
  const formattedSeller1SaleDate = formatDate(seller1SaleDate);
  
 
  let dataToUse = formData;
  if (formData.isMultipleTransfer && formData.transfersData && formData.transfersData.length > 0) {
    dataToUse = formData.transfersData[0];
    console.log('Using data from first transfer in multiple transfer set');
    
 
    if (!seller1SaleDate && dataToUse.sellerInfo && dataToUse.sellerInfo.sellers && dataToUse.sellerInfo.sellers.length > 0) {
      seller1SaleDate = dataToUse.sellerInfo.sellers[0].saleDate || '';
      console.log("Found seller1's sale date from transfer data:", seller1SaleDate);
    }
  }
  
  let owners: any[] = [];
  if (dataToUse.newOwners && dataToUse.newOwners.owners) {
    owners = dataToUse.newOwners.owners || [];
  } 
  
  const owner1 = owners[0] || {};
  const owner2 = owners[1] || {};
  const owner3 = owners[2] || {};
  
  const addressData = dataToUse.address || {};
  
  const vehicleInfo = dataToUse.vehicleInformation || {};
  
  const vehicleTransactionDetails = dataToUse.vehicleTransactionDetails || {};
  const hasCurrentLienholder = vehicleTransactionDetails.currentLienholder === true;
  
  const legalOwnerInfo = dataToUse.legalOwner || {};
  const legalOwnerAddress = legalOwnerInfo.address || {};
  
  safeSetText(fieldMapping.licensePlate, vehicleInfo.licensePlate || '');
  safeSetText(fieldMapping.hullId, vehicleInfo.hullId || vehicleInfo.vinNumber || '');
  safeSetText(fieldMapping.make, vehicleInfo.make || '');
  
  if (Object.keys(owner1).length > 0) {
    safeSetText(fieldMapping.newOwner1Name, formatOwnerNamePrint(owner1));
    
    if (owner1.licenseNumber) {
      fillCharacterFields(fieldMapping.newOwner1License, owner1.licenseNumber);
    }
    
 
    if (seller1SaleDate) {
      safeSetText(fieldMapping.purchaseDate, formattedSeller1SaleDate);
      console.log(`Using seller1's sale date for purchase date: ${formattedSeller1SaleDate}`);
    } else if (owner1.purchaseDate) {
 
      safeSetText(fieldMapping.purchaseDate, formatDate(owner1.purchaseDate));
      console.log(`Using owner1's purchase date as fallback: ${formatDate(owner1.purchaseDate)}`);
    }
    
    if (owner1.purchaseValue) {
      safeSetText(fieldMapping.purchasePrice, owner1.purchaseValue);
    }
  }
  
  safeSetText(fieldMapping.regOwnerAddress, addressData.street || '');
  safeSetText(fieldMapping.regOwnerCity, addressData.city || '');
  safeSetText(fieldMapping.regOwnerState, addressData.state || '');
  safeSetText(fieldMapping.regOwnerZip, addressData.zip || '');
  
  if (Object.keys(owner2).length > 0) {
    safeSetText(fieldMapping.newOwner2Name, formatOwnerNamePrint(owner2));
    
    if (owner2.licenseNumber) {
      fillCharacterFields(fieldMapping.newOwner2License, owner2.licenseNumber);
    }
    
    if (owner2.relationshipType) {
      safeSetRadioGroup(fieldMapping.regOwnerAndOr, owner2.relationshipType);
      safeSetRadioGroup(fieldMapping.regOwnerAndOr2, owner2.relationshipType);
    }
  }
  
  if (Object.keys(owner3).length > 0) {
    safeSetText(fieldMapping.newOwner3Name, formatOwnerNamePrint(owner3));
    
    if (owner3.licenseNumber) {
      fillCharacterFields(fieldMapping.newOwner3License, owner3.licenseNumber);
    }
    
    if (owner3.relationshipType) {      
      safeSetRadioGroup(fieldMapping.regOwnerAndOr3, owner3.relationshipType);
      safeSetRadioGroup(fieldMapping.regOwnerAndOr4, owner3.relationshipType);
    }
  }
  
  if (hasCurrentLienholder && Object.keys(legalOwnerInfo).length > 0) {
    safeSetText(fieldMapping.lienHolderName, legalOwnerInfo.name || '');
    safeSetText(fieldMapping.lienHolderAddress, legalOwnerAddress.street || '');
    safeSetText(fieldMapping.lienHolderCity, legalOwnerAddress.city || '');
    safeSetText(fieldMapping.lienHolderState, legalOwnerAddress.state || '');
    safeSetText(fieldMapping.lienHolderZip, legalOwnerAddress.zip || '');
  } else {
    safeSetText(fieldMapping.lienHolderName, "NONE");
  }

  if (dataToUse.lesseeAddressDifferent === true) {
    safeSetCheckBox(fieldMapping.leaseVehicleOnly, true);

    const lesseeAddress = dataToUse.lesseeAddress || {};
    safeSetText(fieldMapping.lienHolderAddress2, lesseeAddress.street || '');
    safeSetText(fieldMapping.lienHolderCity2, lesseeAddress.city || '');
    safeSetText(fieldMapping.lienHolderState2, lesseeAddress.state || '');
    safeSetText(fieldMapping.lienHolderZip2, lesseeAddress.zip || '');
  } else if (dataToUse.trailerLocationDifferent === true) {
    safeSetCheckBox(fieldMapping.vesselsOnly,true);

    const trailerLocation = dataToUse.trailerLocation || {};
    safeSetText(fieldMapping.lienHolderAddress2, trailerLocation.street || '');
    safeSetText(fieldMapping.lienHolderCity2, trailerLocation.city || '');
    safeSetText(fieldMapping.lienHolderState2, trailerLocation.state || '');
    safeSetText(fieldMapping.lienHolderZip2, trailerLocation.zip || '');
  } else {
    safeSetText(fieldMapping.lienHolderAddress2, "NONE");
    safeSetText(fieldMapping.lienHolderCity2, "");
    safeSetText(fieldMapping.lienHolderState2, "");
    safeSetText(fieldMapping.lienHolderZip2, "");
  }
  
  form.updateFieldAppearances();
  
  pdfDoc.catalog.set(PDFName.of('NeedAppearances'), PDFBool.True);
  
  return await pdfDoc.save();
}

async function modifyReg156Pdf(fileBytes: ArrayBuffer, formData: any, transactionType?: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
  
  const form = pdfDoc.getForm();
  
  const fieldNames = form.getFields().map(f => f.getName());
  console.log('Available Reg156 PDF Fields:', JSON.stringify(fieldNames, null, 2));
  
  console.log('===== COMPLETE FORM DATA =====');
  console.log(JSON.stringify(formData, null, 2));
  console.log('=============================');  console.log('Transaction type passed directly:', transactionType);  console.log('Raw formData object type property:', formData.type);  if (!transactionType) {    if (formData.transactionType) {
      transactionType = formData.transactionType;
      console.log(`Found transaction type in formData.transactionType: "${transactionType}"`);
    } else if (formData.type) {
      transactionType = formData.type;
      console.log(`Found transaction type in formData.type: "${transactionType}"`);
    } else if (formData.formData && formData.formData.transactionType) {
      transactionType = formData.formData.transactionType;
      console.log(`Found transaction type in formData.formData.transactionType: "${transactionType}"`);
    } else if (formData.formData && formData.formData.type) {
      transactionType = formData.formData.type;
      console.log(`Found transaction type in formData.formData.type: "${transactionType}"`);
    } else {      if (formData.pnoDetails && formData.pnoDetails.requestPnoCard) {
        transactionType = "Filing PNO Transfer";
        console.log(`Found PNO details, setting transaction type to: "Filing PNO Transfer"`);
      } else {
        transactionType = "Duplicate Registration Transfer";
        console.log(`No transaction type found anywhere, using default: "Duplicate Registration Transfer"`);
      }
    }
  } else {
    console.log(`Using provided transaction type: "${transactionType}"`);
  }
  
  const isDuplicateStickers = transactionType === "Duplicate Stickers";
  const isDuplicatePlatesAndStickers = transactionType === "Duplicate Plates & Stickers";
  const isDuplicateTitleTransfer = transactionType === "Duplicate Title Transfer";
  const isDuplicateRegistrationTransfer = transactionType === "Duplicate Registration Transfer";
  const isFilingPNOTransfer = transactionType === "Filing PNO Transfer";
  
  console.log(`Transaction type: "${transactionType}", isDuplicateStickers: ${isDuplicateStickers}, isDuplicatePlatesAndStickers: ${isDuplicatePlatesAndStickers}, isDuplicateTitleTransfer: ${isDuplicateTitleTransfer}, isDuplicateRegistrationTransfer: ${isDuplicateRegistrationTransfer}, isFilingPNOTransfer: ${isFilingPNOTransfer}`);
  
  const fieldMapping = {
    "Vehicle license plate": "vehicleInformation.licensePlate",
    "Make": "vehicleInformation.make",
    "VIN": "vehicleInformation.hullId", 
    "Engine number": "vehicleInformation.engineNumber",


    "True full name": "sellerInfo.sellers.0", 
    "DL1": "sellerInfo.sellers.0.licenseNumber.0",
    "DL2": "sellerInfo.sellers.0.licenseNumber.1",
    "DL3": "sellerInfo.sellers.0.licenseNumber.2",
    "DL4": "sellerInfo.sellers.0.licenseNumber.3",
    "DL5": "sellerInfo.sellers.0.licenseNumber.4",
    "DL6": "sellerInfo.sellers.0.licenseNumber.5",
    "DL7": "sellerInfo.sellers.0.licenseNumber.6",
    "DL8": "sellerInfo.sellers.0.licenseNumber.7",

    "Co owner": "sellerInfo.sellers.1", 
    "2DL1": "sellerInfo.sellers.1.licenseNumber.0",
    "2DL2": "sellerInfo.sellers.1.licenseNumber.1",
    "2DL3": "sellerInfo.sellers.1.licenseNumber.2",
    "2DL4": "sellerInfo.sellers.1.licenseNumber.3",
    "2DL5": "sellerInfo.sellers.1.licenseNumber.4",
    "2DL6": "sellerInfo.sellers.1.licenseNumber.5",
    "2DL7": "sellerInfo.sellers.1.licenseNumber.6",
    "2DL8": "sellerInfo.sellers.1.licenseNumber.7",

    "Physical address": "sellerAddress.street",
    "Apt #": "sellerAddress.apt",
    "City": "sellerAddress.city",
    "state": "sellerAddress.state",
    "zip code": "sellerAddress.zip",

    "Mailing address": "sellerMailingAddress.street",
    "Apt 2": "sellerMailingAddress.apt",
    "City2": "sellerMailingAddress.city",
    "state2": "sellerMailingAddress.state",
    "zip code2": "sellerMailingAddress.zip",
    
    "area code": "sellerInfo.sellers.0.phoneNumber.areaCode",
    "telephone number": "sellerInfo.sellers.0.phoneNumber.number",
    
    "title": "title",
    
    "date": "", 
    "certification": "", 
  };
  
  const checkboxMapping = {
    "Lost": "itemRequested.lost",
    "Stolen": "itemRequested.stolen",
    "destroyed": "itemRequested.destroyedMutilated",
    "Not Received DMV": "itemRequested.notReceivedFromDMV",
    "Not received prior owner": "itemRequested.notReceivedFromPriorOwner",
    "Surrendered": "itemRequested.surrendered",
    "one": "itemRequested.numberOfPlatesSurrendered", 
    "Two": "itemRequested.numberOfPlatesSurrendered", 
    "Special plates": "itemRequested.specialPlatesRetained",
    "REG card with current address": "itemRequested.requestingRegistrationCard",
    "CVC": "itemRequested.perCVC4467",
    "other": "itemRequested.other",
    
    "One license": "licensePlate.oneMissingPlate",
    "Two plates": "licensePlate.twoMissingPlates",
    
    "PNO": "pnoDetails.requestPnoCard"  };
  
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
  
  const safeSetRadioGroup = (fieldName: string, value: string) => {
    try {
      const radioGroup = form.getRadioGroup(fieldName);
      if (radioGroup) {
        const options = radioGroup.getOptions();
        console.log(`Radio group options for ${fieldName}:`, options);
        
        const normalizedValue = value.toLowerCase();
        
        if (options.includes(normalizedValue)) {
          radioGroup.select(normalizedValue);
          console.log(`Successfully selected radio option ${normalizedValue} for ${fieldName}`);
        } else {
          console.warn(`Invalid option ${value} for radio group ${fieldName}. Available options: ${options.join(', ')}`);
        }
      } else {
        console.warn(`Radio group not found: ${fieldName}`);
      }
    } catch (error) {
      console.error(`Error setting radio group ${fieldName}:`, error);
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
  
  const getCurrentDate = () => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    
    return `${month}/${day}/${year}`;
  };
  
  const getNestedProperty = (obj: any, path: string): any => {
    if (!obj || !path) return undefined;
    
    const parts = path.split('.');
    let current = obj;
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      
      if (part.match(/^\d+$/) && Array.isArray(current)) {
        const index = parseInt(part);
        current = current[index];
      } else {
        current = current[part];
      }
      
      if (current === undefined || current === null) {
        return undefined;
      }
    }
    
    return current;
  };
  
  console.log("License Plate Data:", formData.licensePlate);
  
  let dataToUse = formData;
  
  if (formData.isMultipleTransfer && formData.transfersData && formData.transfersData.length > 0) {
    dataToUse = formData.transfersData[0];
    console.log('Using data from first transfer in multiple transfer set');
  }
  
  const owners = dataToUse.owners || [];
  const owner1 = owners[0] || {};
  
  const vehicleInfo = dataToUse.vehicleInformation || {};
  const addressData = dataToUse.address || {};
  const sellerInfo = dataToUse.sellerInfo || { sellers: [] };
  const vehicleTransactionDetails = dataToUse.vehicleTransactionDetails || {};
  const itemRequestedData = dataToUse.itemRequested || {};
  const licensePlateData = dataToUse.licensePlate || {};
  
  const sellers = sellerInfo.sellers || [];
  const seller1 = sellers[0] || {};
  const seller2 = sellers[1] || {};
  
  let seller1SaleDate = '';
  if (seller1 && seller1.saleDate) {
    seller1SaleDate = seller1.saleDate;
    console.log(`Found seller1's sale date: ${seller1SaleDate}`);
  }
  
  const formattedSellerSaleDate = formatDate(seller1SaleDate);
  
  for (const [pdfField, formField] of Object.entries(fieldMapping)) {
    try {
      if (pdfField === "True full name" || pdfField === "Co owner" || 
          pdfField === "date" || pdfField === "certification") {
        continue;
      }
      
      if (pdfField === "area code" || pdfField === "telephone number") {
        let phoneValue = '';
        
        const phoneFromStructured = getNestedProperty(dataToUse, formField);
        const phoneFromField = getNestedProperty(dataToUse, "sellerInfo.sellers.0.phone") || 
                               getNestedProperty(dataToUse, "sellerInfo.sellers.0.phoneNumber");
        
        if (phoneFromStructured) {
          phoneValue = phoneFromStructured;
        } else if (phoneFromField) {
          const fullPhone = phoneFromField.toString().replace(/\D/g, '');
          
          if (pdfField === "area code" && fullPhone.length >= 3) {
            phoneValue = fullPhone.substring(0, 3);
          } else if (pdfField === "telephone number" && fullPhone.length > 3) {
            phoneValue = fullPhone.substring(3);
          }
        }
        
        safeSetText(pdfField, String(phoneValue));
        continue;
      }
      
      const value = getNestedProperty(dataToUse, formField) || '';
      
      safeSetText(pdfField, String(value));
    } catch (error) {
      console.error(`Error applying mapping for field ${pdfField}:`, error);
    }
  }
  
  if (seller1) {
    const seller1FullName = `${seller1.lastName || ''}, ${seller1.firstName || ''} ${seller1.middleName || ''}`.trim();
    safeSetText("True full name", seller1FullName);
    
    if (seller1.licenseNumber) {
      const licenseFields = ["DL1", "DL2", "DL3", "DL4", "DL5", "DL6", "DL7", "DL8"];
      fillCharacterFields(licenseFields, seller1.licenseNumber);
    }
    
    if (!seller1.phoneNumber?.areaCode && !seller1.phoneNumber?.number) {
      try {
        const phoneNumber = seller1.phone || seller1.phoneNumber || '';
        if (phoneNumber) {
          const cleanPhone = phoneNumber.toString().replace(/\D/g, '');
          
          if (cleanPhone.length >= 10) {
            const areaCode = cleanPhone.substring(0, 3);
            const number = cleanPhone.substring(3);
            
            console.log(`Parsed phone number: (${areaCode}) ${number}`);
            safeSetText("area code", areaCode);
            safeSetText("telephone number", number);
          }
        }
      } catch (error) {
        console.error("Error processing phone number:", error);
      }
    }
  }
  
  if (seller2) {
    const seller2FullName = `${seller2.lastName || ''}, ${seller2.firstName || ''} ${seller2.middleName || ''}`.trim();
    safeSetText("Co owner", seller2FullName);
    
    if (seller2.licenseNumber) {
      const licenseFields = ["2DL1", "2DL2", "2DL3", "2DL4", "2DL5", "2DL6", "2DL7", "2DL8"];
      fillCharacterFields(licenseFields, seller2.licenseNumber);
    }
  }
  
  if (!dataToUse.sellerMailingAddressDifferent && dataToUse.sellerAddress) {
    safeSetText("Mailing address", dataToUse.sellerAddress.street || '');
    safeSetText("Apt 2", dataToUse.sellerAddress.apt || '');
    safeSetText("City2", dataToUse.sellerAddress.city || '');
    safeSetText("state2", dataToUse.sellerAddress.state || '');
    safeSetText("zip code2", dataToUse.sellerAddress.zip || '');
  }  if (isFilingPNOTransfer) {
    console.log('Processing Filing PNO Transfer transaction type');    safeSetCheckbox("PNO", true);    safeSetCheckbox("License plates", false);
    safeSetCheckbox("license month", false);
    safeSetCheckbox("license year", false);
    safeSetCheckbox("Reg Card", false);    safeSetCheckbox("other", false);
    safeSetText("Explanation", "");    for (const fieldName of Object.keys(checkboxMapping)) {
      if (fieldName !== "PNO") {        safeSetCheckbox(fieldName, false);
      }
    }  }
  else if (isDuplicateStickers) {
    console.log('Processing Duplicate Stickers transaction type');
    
    safeSetCheckbox("License plates", false);
    
    const monthChecked = dataToUse.duplicateStickers && 'month' in dataToUse.duplicateStickers
      ? dataToUse.duplicateStickers.month
      : (dataToUse.activeSubOptions && dataToUse.activeSubOptions["Duplicate Stickers-Month"] === true);
    
    const yearChecked = dataToUse.duplicateStickers && 'year' in dataToUse.duplicateStickers
      ? dataToUse.duplicateStickers.year
      : (dataToUse.activeSubOptions && dataToUse.activeSubOptions["Duplicate Stickers-Year"] === true);
      
    console.log(`Duplicate Stickers options from context - Month: ${monthChecked}, Year: ${yearChecked}`);
    
    safeSetCheckbox("license month", monthChecked);
    safeSetCheckbox("license year", yearChecked);
    
    const isOtherChecked = getNestedProperty(dataToUse, "itemRequested.other") || false;
    safeSetCheckbox("other", isOtherChecked);
    
    if (isOtherChecked) {
      const explanation = getNestedProperty(dataToUse, "itemRequested.otherExplanation") || '';
      safeSetText("Explanation", explanation);
    }
  } 
  else if (isDuplicatePlatesAndStickers) {
    console.log('Processing Duplicate Plates & Stickers transaction type - ALWAYS checking all three options');
    
    safeSetCheckbox("License plates", true);
    safeSetCheckbox("license month", true);
    safeSetCheckbox("license year", true);
    
    const isOtherChecked = getNestedProperty(dataToUse, "itemRequested.other") || false;
    safeSetCheckbox("other", isOtherChecked);
    
    if (isOtherChecked) {
      const explanation = getNestedProperty(dataToUse, "itemRequested.otherExplanation") || '';
      safeSetText("Explanation", explanation);
    }
  }
  else if (isDuplicateTitleTransfer) {
    console.log('Processing Duplicate Title Transfer transaction type');
    
    safeSetCheckbox("License plates", false);
    safeSetCheckbox("license month", false);
    safeSetCheckbox("license year", false);
    safeSetCheckbox("Reg Card", true);
    
    safeSetCheckbox("other", true);
    safeSetText("Explanation", "Requesting a duplicate title");
  }
  else if (isDuplicateRegistrationTransfer) {
    console.log('Processing Duplicate Registration Transfer transaction type');
    
    safeSetCheckbox("License plates", false);
    safeSetCheckbox("license month", false);
    safeSetCheckbox("license year", false);
    safeSetCheckbox("Reg Card", true);
    
    safeSetCheckbox("other", true);
    safeSetText("Explanation", "Requesting a duplicate registration card");
  }
  else {
    console.log('Processing other transaction type');
    
    safeSetCheckbox("License plates", true);
    safeSetCheckbox("license month", true);
    safeSetCheckbox("license year", true);
    
    const isOtherChecked = getNestedProperty(dataToUse, "itemRequested.other") || false;
    safeSetCheckbox("other", isOtherChecked);
    
    if (isOtherChecked) {
      const explanation = getNestedProperty(dataToUse, "itemRequested.otherExplanation") || '';
      safeSetText("Explanation", explanation);
    }
  }  if (!isFilingPNOTransfer) {    for (const [pdfField, formField] of Object.entries(checkboxMapping)) {
      try {        if (pdfField === "License plates" || 
            pdfField === "license month" || 
            pdfField === "license year" || 
            pdfField === "Reg Card" || 
            pdfField === "other" ||
            pdfField === "PNO") {
          continue;
        }
        
        if (pdfField === "one" || pdfField === "Two") {
          if (!getNestedProperty(dataToUse, "itemRequested.surrendered")) {
            continue;
          }
          
          const numberOfPlatesSurrendered = getNestedProperty(dataToUse, "itemRequested.numberOfPlatesSurrendered");
          const shouldCheck = (pdfField === "one" && numberOfPlatesSurrendered === "One") ||
                              (pdfField === "Two" && numberOfPlatesSurrendered === "Two");
          
          safeSetCheckbox(pdfField, shouldCheck);
          continue;
        }
        
        if (pdfField === "Two plates") {
          const value = getNestedProperty(dataToUse, formField) || false;
          console.log(`Setting "${pdfField}" checkbox to: ${value}`, {
            path: formField,
            rawValue: getNestedProperty(dataToUse, formField),
            finalValue: value
          });
          safeSetCheckbox(pdfField, value);
          continue;
        }
        
        const value = getNestedProperty(dataToUse, formField) || false;
        safeSetCheckbox(pdfField, value);
      } catch (error) {
        console.error(`Error applying checkbox mapping for field ${pdfField}:`, error);
      }
    }
  }
  
  if (seller1SaleDate) {
    console.log(`Using seller1's sale date: ${formattedSellerSaleDate}`);
    safeSetText("date", formattedSellerSaleDate);
  } else {
    const currentDate = getCurrentDate();
    console.log(`No seller sale date found, using current date: ${currentDate}`);
    safeSetText("date", currentDate);
  }
  
  if (seller1) {
    const seller1Name = `${seller1.firstName || ''} ${seller1.middleName || ''} ${seller1.lastName || ''}`.trim();
    console.log(`Setting certification name: ${seller1Name}`);
    safeSetText("certification", seller1Name);
  }
  
  form.updateFieldAppearances();
  pdfDoc.catalog.set(PDFName.of('NeedAppearances'), PDFBool.True);
  
  return await pdfDoc.save();
}


interface Address {
  streetNumber?: string;
  streetName?: string;
  aptNo?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  county?: string; 
}
interface Address {
  streetNumber?: string;
  streetName?: string;
  aptNo?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  county?: string;
}

interface SectionThreeData {
  address?: Address;
  mailingAddress?: Address;
  trailerVesselAddress?: Address; 
  mailingAddressDifferent?: boolean;
  hasTrailerVessel?: boolean; 
}

interface VehicleEntry {
  plateCfNumber?: string;
  vehicleHullId?: string;
  leased?: 'inside' | 'outside';
  registeredLocation?: 'inside' | 'outside';
}

interface CitizenshipData {
  isUsCitizen?: boolean;
}

interface LeasedVehiclesData {
  isLeased: boolean;
  leasingCompanyName: string;
}

interface FormData {
  personalBusinessInfo?: {
    lastName?: string;
    firstName?: string;
    initial?: string;
    birthDate?: string;
    driverLicenseId?: string;
  };
  previousResidence?: Address;
  newOrCorrectResidence?: SectionThreeData;
  vehiclesOwned?: VehicleEntry[];
  voterAddressUpdate?: {
    doNotUpdateVoterRegistration?: boolean;
  };
  citizenship?: CitizenshipData;
  leasedVehicles?: LeasedVehiclesData;
}

async function modifyDMV14Pdf(fileBytes: ArrayBuffer, formData: FormData): Promise<Uint8Array> {
  try {
    const pdfDoc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
    
    if (!pdfDoc) {
      console.error('Failed to load PDF document');
      throw new Error('Failed to load PDF document');
    }
    
    const form = pdfDoc.getForm();
    
    if (!form) {
      console.error('Failed to get form from PDF');
      throw new Error('Failed to get form from PDF');
    }
    
 
    try {
      const fieldNames = form.getFields().map(f => f.getName());
      console.log('Available DMV14 PDF Fields:', JSON.stringify(fieldNames, null, 2));
    } catch (error) {
      console.error('Error getting field names:', error);
    }
    
 
    try {
      mapPersonalBusinessInfo(form, formData.personalBusinessInfo);
      mapPreviousResidence(form, formData.previousResidence);
      mapNewOrCorrectResidence(form, formData.newOrCorrectResidence);
      mapVoterAddressUpdate(form, formData.voterAddressUpdate);
      mapVehiclesOwned(form, formData.vehiclesOwned);
      mapCitizenshipStatus(form, formData.citizenship);
      mapLeasingCompany(form, formData.leasedVehicles);
      mapCurrentDateToSec10(form);
      mapS8cEligible(form);

    } catch (error) {
      console.error('Error mapping form data to PDF fields:', error);
    }
    
    try {
      form.updateFieldAppearances();
    } catch (e) {
      console.warn('Error updating field appearances, continuing anyway:', e);
    }
    
    return await pdfDoc.save({
      useObjectStreams: false,
      addDefaultPage: false,
      updateFieldAppearances: false
    });
  } catch (error) {
    console.error('Error in modifyDMV14Pdf:', error);
    
    const emptyPdf = await PDFDocument.create();
    return await emptyPdf.save();
  }
}

 
function mapLeasingCompany(form: any, leasedVehiclesData?: LeasedVehiclesData) {
  if (!leasedVehiclesData || !leasedVehiclesData.isLeased || !leasedVehiclesData.leasingCompanyName) return;

  try {
    const leasingCoFields = [
      "leasing co.0",
      "leasing co.1",
      "leasing co.2",
      "leasing co.3",
      "leasing co.4",
      "leasing co.5",
      "leasing co.6",
      "leasing co.7",
      "leasing co.8",
      "leasing co.9",
      "leasing co.10",
      "leasing co.11",
      "leasing co.12",
      "leasing co.13",
      "leasing co.14",
      "leasing co.15",
      "leasing co.16",
      "leasing co.17",
      "leasing co.18",
      "leasing co.19",
      "leasing co.20",
      "leasing co.21"
    ];
    
    const companyName = leasedVehiclesData.leasingCompanyName.toUpperCase();
    
    for (let i = 0; i < companyName.length && i < leasingCoFields.length; i++) {
      const field = form.getTextField(leasingCoFields[i]);
      if (field) {
        field.setText(companyName.charAt(i));
      }
    }
    
    console.log(`Successfully set leasing company name: ${companyName}`);
  } catch (e) {
    console.warn('Error setting leasing company fields:', e);
    
 
    try {
 
      const singleFieldNames = [
        "Leasing Company",
        "LEASING COMPANY",
        "leasing_company",
        "LeasingCompany"
      ];
      
      for (const fieldName of singleFieldNames) {
        try {
          const field = form.getTextField(fieldName);
          if (field) {
            field.setText(leasedVehiclesData.leasingCompanyName);
            console.log(`Successfully set "${fieldName}" field to ${leasedVehiclesData.leasingCompanyName}`);
            break;
          }
        } catch (e) {
 
        }
      }
    } catch (fallbackError) {
      console.warn('Error setting fallback leasing company field:', fallbackError);
    }
  }
}

 
function mapCitizenshipStatus(form: any, citizenshipData?: CitizenshipData) {
  if (!citizenshipData || citizenshipData.isUsCitizen === undefined) return;

  try {
    if (citizenshipData.isUsCitizen === true) {
 
      const citizenYesField = form.getCheckBox("S8a Yes");
      if (citizenYesField) {
        citizenYesField.check();
        console.log('Successfully checked "S8a Yes" checkbox');
      } else {
 
        const yesAlternativeFieldNames = [
          "s8a yes",
          "S8aYes",
          "citizen_yes",
          "CitizenYes",
          "US Citizen Yes"
        ];
        
        for (const fieldName of yesAlternativeFieldNames) {
          try {
            const field = form.getCheckBox(fieldName);
            if (field) {
              field.check();
              console.log(`Successfully checked "${fieldName}" checkbox for US Citizen Yes`);
              break;
            }
          } catch (e) {
 
          }
        }
      }
    } else if (citizenshipData.isUsCitizen === false) {
 
      const citizenNoField = form.getCheckBox("S8a No");
      if (citizenNoField) {
        citizenNoField.check();
        console.log('Successfully checked "S8a No" checkbox');
      } else {
 
        const noAlternativeFieldNames = [
          "s8a no",
          "S8aNo",
          "citizen_no",
          "CitizenNo",
          "US Citizen No"
        ];
        
        for (const fieldName of noAlternativeFieldNames) {
          try {
            const field = form.getCheckBox(fieldName);
            if (field) {
              field.check();
              console.log(`Successfully checked "${fieldName}" checkbox for US Citizen No`);
              break;
            }
          } catch (e) {
 
          }
        }
      }
    }
  } catch (e) {
    console.warn('Error setting citizenship status fields:', e);
  }
}

function mapVehiclesOwned(form: any, vehiclesOwned?: VehicleEntry[]) {
  if (!vehiclesOwned || vehiclesOwned.length === 0) return;

 
  for (let i = 0; i < Math.min(vehiclesOwned.length, 3); i++) {
    const vehicle = vehiclesOwned[i];
    const vehicleIndex = i + 1; 

 
    if (vehicle.plateCfNumber) {
      try {
        const plateFields = getPlateFieldsForIndex(vehicleIndex);
        const plateNumber = vehicle.plateCfNumber.toUpperCase();
        
        for (let j = 0; j < plateNumber.length && j < plateFields.length; j++) {
          const field = form.getTextField(plateFields[j]);
          if (field) {
            field.setText(plateNumber.charAt(j));
          }
        }
      } catch (e) {
        console.warn(`Error setting plate/CF/placard fields for vehicle ${vehicleIndex}:`, e);
      }
    }

 
    if (vehicle.vehicleHullId) {
      try {
        const hullIdFields = getHullIdFieldsForIndex(vehicleIndex);
        const hullId = vehicle.vehicleHullId.toUpperCase();
        
        for (let j = 0; j < hullId.length && j < hullIdFields.length; j++) {
          const field = form.getTextField(hullIdFields[j]);
          if (field) {
            field.setText(hullId.charAt(j));
          }
        }
      } catch (e) {
        console.warn(`Error setting hull ID fields for vehicle ${vehicleIndex}:`, e);
      }
    }

 
    try {
 
      if (vehicle.leased === 'inside') {
        const leasedCheckboxFieldName = `Check Box3.${i}`; 
        const leasedCheckboxField = form.getCheckBox(leasedCheckboxFieldName);
        
        if (leasedCheckboxField) {
          leasedCheckboxField.check();
          console.log(`Successfully checked "${leasedCheckboxFieldName}" for leased vehicle ${vehicleIndex}`);
        } else {
          console.warn(`Could not find checkbox field "${leasedCheckboxFieldName}" for leased vehicle ${vehicleIndex}`);
          
 
          const alternativeFieldNames = [
            `Leased ${vehicleIndex}`,
            `leased_${vehicleIndex}`,
            `Leased Vehicle ${vehicleIndex}`
          ];
          
          for (const fieldName of alternativeFieldNames) {
            try {
              const field = form.getCheckBox(fieldName);
              if (field) {
                field.check();
                console.log(`Successfully checked "${fieldName}" for leased vehicle ${vehicleIndex}`);
                break;
              }
            } catch (e) {
 
            }
          }
        }
      }

 
      if (vehicle.registeredLocation === 'inside') {
        const registeredOutsideFieldName = `Check Box4.${i}`; 
        const registeredOutsideField = form.getCheckBox(registeredOutsideFieldName);
        
        if (registeredOutsideField) {
          registeredOutsideField.check();
          console.log(`Successfully checked "${registeredOutsideFieldName}" for registered outside CA vehicle ${vehicleIndex}`);
        } else {
          console.warn(`Could not find checkbox field "${registeredOutsideFieldName}" for registered outside CA vehicle ${vehicleIndex}`);
          
 
          const alternativeFieldNames = [
            `Registered Outside CA ${vehicleIndex}`,
            `registered_outside_${vehicleIndex}`,
            `Outside CA ${vehicleIndex}`
          ];
          
          for (const fieldName of alternativeFieldNames) {
            try {
              const field = form.getCheckBox(fieldName);
              if (field) {
                field.check();
                console.log(`Successfully checked "${fieldName}" for registered outside CA vehicle ${vehicleIndex}`);
                break;
              }
            } catch (e) {
 
            }
          }
        }
      }
    } catch (e) {
      console.warn(`Error setting checkbox fields for vehicle ${vehicleIndex}:`, e);
    }
  }
}

function mapS8cEligible(form: any) {
  try {
 
    const s8cEligibleField = form.getCheckBox("S8c Eligible");
    if (s8cEligibleField) {
      s8cEligibleField.check(); 
      console.log('Successfully checked "S8c Eligible" checkbox');
    } else {
 
      const alternativeFieldNames = [
        "s8c eligible",
        "S8cEligible",
        "s8c_eligible",
        "Section 8c Eligible"
      ];
      
      for (const fieldName of alternativeFieldNames) {
        try {
          const field = form.getCheckBox(fieldName);
          if (field) {
            field.check();
            console.log(`Successfully checked "${fieldName}" checkbox`);
            break;
          }
        } catch (e) {
 
        }
      }
    }
  } catch (e) {
    console.warn('Error setting S8c Eligible field:', e);
  }
}

 
function mapCurrentDateToSec10(form: any) {
  try {
 
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const year = today.getFullYear().toString();
    const formattedDate = `${month}/${day}/${year}`;
    
 
    const sec10DateField = form.getTextField("Sec10 date");
    if (sec10DateField) {
      sec10DateField.setText(formattedDate);
      console.log(`Successfully set "Sec10 date" to ${formattedDate}`);
    } else {
 
      const alternativeFieldNames = [
        "sec10 date",
        "Sec10Date",
        "sec10_date",
        "Section10Date",
        "Section 10 Date"
      ];
      
      for (const fieldName of alternativeFieldNames) {
        try {
          const field = form.getTextField(fieldName);
          if (field) {
            field.setText(formattedDate);
            console.log(`Successfully set "${fieldName}" to ${formattedDate}`);
            break;
          }
        } catch (e) {
 
        }
      }
    }
  } catch (e) {
    console.warn('Error setting Sec10 date field:', e);
  }
}


 
function getPlateFieldsForIndex(index: number): string[] {
  if (index === 1) {
    return [
      "California plate 1.0",
      "California plate 1.1",
      "California plate 1.2",
      "California plate 1.3",
      "California plate 1.4",
      "California plate 1.5",
      "California plate 1.6",
      "California plate 1.7"
    ];
  } else if (index === 2) {
    return [
      "California plate 2.0",
      "California plate 2.1",
      "California plate 2.2",
      "California plate 2.3",
      "California plate 2.4",
      "California plate 2.5",
      "California plate 2.6",
      "California plate 2.7"
    ];
  } else if (index === 3) {
    return [
      "California plate 3.0",
      "California plate 3.1",
      "California plate 3.2",
      "California plate 3.3",
      "California plate 3.4",
      "California plate 3.5",
      "California plate 3.6",
      "California plate 3.7"
    ];
  }
  return [];
}

 
function getHullIdFieldsForIndex(index: number): string[] {
  if (index === 1) {
    return [
      "HULL ID.0",
      "HULL ID.1",
      "HULL ID.2",
      "HULL ID.3",
      "HULL ID.4",
      "HULL ID.5",
      "HULL ID.6",
      "HULL ID.7",
      "HULL ID.8",
      "HULL ID.9",
      "HULL ID.10",
      "HULL ID.11",
      "HULL ID.12",
      "HULL ID.13",
      "HULL ID.14",
      "HULL ID.15",
      "HULL ID.16"
    ];
  } else if (index === 2) {
    return [
      "HULL ID 2.0",
      "HULL ID 2.1",
      "HULL ID 2.2",
      "HULL ID 2.3",
      "HULL ID 2.4",
      "HULL ID 2.5",
      "HULL ID 2.6",
      "HULL ID 2.7",
      "HULL ID 2.8",
      "HULL ID 2.9",
      "HULL ID 2.10",
      "HULL ID 2.11",
      "HULL ID 2.12",
      "HULL ID 2.13",
      "HULL ID 2.14",
      "HULL ID 2.15"
    ];
  } else if (index === 3) {
    return [
      "HULL ID 3.0",
      "HULL ID 3.1",
      "HULL ID 3.2",
      "HULL ID 3.3",
      "HULL ID 3.4",
      "HULL ID 3.5",
      "HULL ID 3.6",
      "HULL ID 3.7",
      "HULL ID 3.8",
      "HULL ID 3.9",
      "HULL ID 3.10",
      "HULL ID 3.11",
      "HULL ID 3.12",
      "HULL ID 3.13",
      "HULL ID 3.14",
      "HULL ID 3.15",
      "HULL ID 3.16"
    ];
  }
  return [];
}

function mapVoterAddressUpdate(form: any, voterAddressUpdateData?: FormData['voterAddressUpdate']) {
  if (!voterAddressUpdateData) return;

  try {
 
    if (voterAddressUpdateData.doNotUpdateVoterRegistration) {
 
      const addressUpdateField = form.getCheckBox("Address Update");
      if (addressUpdateField) {
        addressUpdateField.check(); 
        console.log('Successfully checked "Address Update" checkbox');
      } else {
 
        const alternativeFieldNames = [
          "address update",
          "AddressUpdate",
          "doNotUpdateVoterRegistration",
          "voter_registration_opt_out"
        ];
        
        for (const fieldName of alternativeFieldNames) {
          try {
            const field = form.getCheckBox(fieldName);
            if (field) {
              field.check();
              console.log(`Successfully checked "${fieldName}" checkbox`);
              break;
            }
          } catch (e) {
 
          }
        }
      }
    }
  } catch (e) {
    console.warn('Error setting voter address update fields:', e);
  }
}




function mapPersonalBusinessInfo(form: any, personalInfo?: FormData['personalBusinessInfo']) {
  if (!personalInfo) return;

 
  if (personalInfo.lastName) {
    const lastNameFields = [
      "last name",
      "last 1.0.0", "last 1.0.1", "last 1.0.2", "last 1.0.3", "last 1.0.4", 
      "last 1.0.5", "last 1.0.6", "last 1.0.7", "last 1.0.8", "last 1.0.9", 
      "last 1.0.10", "last 1.0.11", "last 1.0.12", "last 1.0.13", "last 1.0.14", 
      "last 1.0.15", "last 1.0.16", "last 1.0.17", "last 1.0.18"
    ];
    
    const lastName = personalInfo.lastName.toUpperCase(); 
    
    for (let i = 0; i < lastName.length && i < lastNameFields.length; i++) {
      try {
        const field = form.getTextField(lastNameFields[i]);
        if (field) {
          field.setText(lastName.charAt(i));
        }
      } catch (e) {
        console.warn(`Field ${lastNameFields[i]} not found or cannot be set`, e);
      }
    }
  }
  
 
  if (personalInfo.firstName) {
    try {
      const firstNameFields = [
        "first name",
        "first.0",
        "first.1",
        "first.2",
        "first.3",
        "first.4",
        "first.5",
        "first.6",
        "first.7",
      ];
      
      const firstName = personalInfo.firstName.toUpperCase();
      
      for (let i = 0; i < firstName.length && i < firstNameFields.length; i++) {
        const field = form.getTextField(firstNameFields[i]);
        if (field) {
          field.setText(firstName.charAt(i));
        }
      }
    } catch (e) {
      console.warn(`Error setting first name fields`, e);
    }
  }

 
  if (personalInfo.initial) {
    try {
      const field = form.getTextField("initial");
      if (field) {
        field.setText(personalInfo.initial.toUpperCase());
      }
    } catch (e) {
      console.warn(`Field 'initial' not found or cannot be set`, e);
    }
  }

 
  if (personalInfo.birthDate) {
    try {
      const birthDateFields = [
        "birth date.0",
        "birth date.1",
        "birth date.2",
        "birth date.3",
        "birth date.4",
        "birth date.5",
        "birth date.6",
        "birth date.7"
      ];
      
      const birthDate = personalInfo.birthDate; 
 
      const digitsOnly = birthDate.replace(/\D/g, '');
      
 
      let fieldIndex = 0;
      for (let i = 0; i < digitsOnly.length && fieldIndex < birthDateFields.length; i++) {
        const field = form.getTextField(birthDateFields[fieldIndex]);
        if (field) {
          field.setText(digitsOnly.charAt(i));
          fieldIndex++; 
        }
      }
    } catch (e) {
      console.warn(`Error setting birth date fields`, e);
    }
  }

 
  if (personalInfo.driverLicenseId) {
    try {
      const driverLicenseFields = [
        "Driver license",
        "Driver license digits.0",
        "Driver license digits.1",
        "Driver license digits.2",
        "Driver license digits.3",
        "Driver license digits.4",
        "Driver license digits.5",
        "Driver license digits.6"
      ];
      
      const driverLicenseId = personalInfo.driverLicenseId.toUpperCase();
      
      for (let i = 0; i < driverLicenseId.length && i < driverLicenseFields.length; i++) {
        const field = form.getTextField(driverLicenseFields[i]);
        if (field) {
          field.setText(driverLicenseId.charAt(i));
        }
      }
    } catch (e) {
      console.warn(`Error setting driver license fields`, e);
    }
  }
}

function mapPreviousResidence(form: any, address?: Address) {
  if (!address) return;

 
  if (address.streetNumber) {
    try {
      const streetNumberFields = [
        "street.0",
        "street 1.0.0",
        "street 1.1.0",
        "street 1.2.0",
        "street 1.3.0",
      ];
      
      const streetNumber = address.streetNumber.toUpperCase();
      
      for (let i = 0; i < streetNumber.length && i < streetNumberFields.length; i++) {
        const field = form.getTextField(streetNumberFields[i]);
        if (field) {
          field.setText(streetNumber.charAt(i));
        }
      }
    } catch (e) {
      console.warn(`Error setting previous residence street number fields`, e);
    }
  }

  if (address.streetName) {
    try {
      const streetNameFields = [
        "street name.0",
        "street name 1.0.0.0",
        "street name 1.0.1.0",
        "street name 1.0.2.0",
        "street name 1.0.3.0",
        "street name 1.0.4.0",
        "street name 1.0.5.0",
        "street name 1.0.6.0",
        "street name 1.0.7.0",
        "street name 1.0.8.0",
        "street name 1.0.9.0",
        "street name 1.0.10.0",
        "street name 1.0.11.0",
        "street name 1.0.12.0",
        "street name 1.0.13.0",
        "street name 1.0.14.0",
        "street name 1.0.15.0",
        "street name 1.0.16.0",
        "street name 1.0.17.0",
        "street name 1.0.18.0",
        "street name 1.0.19.0.0",
        "street name 1.0.19.1.0",
        "street name 1.0.20.0.0",
        "street name 1.0.20.1.0",
      "street name 1.0.20.2.0",
      "street name 1.0.20.3.0",
      "street name 1.0.20.4.0", 
      "street name 1.0.20.5.0", 
      "street name 1.0.20.6.0", 
      "street name 1.0.20.7.0", 
      "street name 1.0.20.8.0", 
      "street name 1.0.20.9.0", 
      "street name 1.0.20.10.0", 
      "street name 1.0.20.11.0", 
      "street name 1.0.20.12.0", 
      "street name 1.0.20.13.0", 
      "street name 1.0.20.14.0", 
      "street name 1.0.20.15.0", 
      "street name 1.0.20.16.0", 
      "street name 1.0.20.17.0", 
      "street name 1.0.20.18.0", 
      "street name 1.0.20.19.0", 
      "street name 1.0.20.20.0", 
      "street name 1.0.20.21.0", 
      
    
    ];
      
      const streetName = address.streetName.toUpperCase();
      
      for (let i = 0; i < streetName.length && i < streetNameFields.length; i++) {
        const field = form.getTextField(streetNameFields[i]);
        if (field) {
          field.setText(streetName.charAt(i));
        }
      }
    } catch (e) {
      console.warn(`Error setting previous residence street name fields`, e);
    }
  }
  if (address.city) {
    try {
      const cityFields = [
        "city.0",
        "city 1.0.0",
        "city 1.1.0",
        "city 1.2.0", 
        "city 1.3.0",
        "city 1.4.0",
        "city 1.5.0",
        "city 1.6.0",
        "city 1.7.0",
        "city 1.8.0",
        "city 1.9.0",
        "city 1.10.0",
        "city 1.11.0",
        "city 1.12.0",
        "city 1.13.0",
        "city 1.14.0",
        "city 1.15.0",
        "city 1.16.0",
        "city 1.17.0",
        "city 1.18.0",
        "city 1.19.0",
        "city 1.20.0",
      ];
      
      const city = address.city.toUpperCase();
      
      for (let i = 0; i < city.length && i < cityFields.length; i++) {
        const field = form.getTextField(cityFields[i]);
        if (field) {
          field.setText(city.charAt(i));
        }
      }
    } catch (e) {
      console.warn(`Error setting previous residence city fields`, e);
    }
  }
 
  if (address.aptNo) {
    try {
      const aptNumberFields = [
        "apt number.0.0",
        "apt number.1.0.0",
        "apt number.1.1.0",
        "apt number.1.2.0",
      ];
      
      const aptNo = address.aptNo.toUpperCase();
      
      for (let i = 0; i < aptNo.length && i < aptNumberFields.length; i++) {
        const field = form.getTextField(aptNumberFields[i]);
        if (field) {
          field.setText(aptNo.charAt(i));
        }
      }
    } catch (e) {
      console.warn(`Error setting previous residence apt number fields`, e);
    }
  }
  
 
  if (address.state) {
    try {
      const stateFields = [
        "state 1.0",
        "state 1.1.1",
      ];
      
      const state = address.state.toUpperCase();
      
 
      if (state.length === 2) {
        for (let i = 0; i < state.length && i < stateFields.length; i++) {
          const field = form.getTextField(stateFields[i]);
          if (field) {
            field.setText(state.charAt(i));
          }
        }
      }
    } catch (e) {
      console.warn(`Error setting previous residence state fields`, e);
    }
  }
  if (address.zipCode) {
    try {
      const zipCodeFields = [
        "zip code.0.0",
        "zip code.1.0.0",
        "zip code.1.1.0",
        "zip code.1.2.0",
        "zip code.1.3.0",
      ];
      
      const cleanZipCode = address.zipCode.replace(/[^0-9]/g, '');
      
      for (let i = 0; i < cleanZipCode.length && i < zipCodeFields.length; i++) {
        const field = form.getTextField(zipCodeFields[i]);
        if (field) {
          field.setText(cleanZipCode.charAt(i));
        }
      }
    } catch (e) {
      console.warn(`Error setting previous residence zip code fields`, e);
    }
  }
 
}

function mapNewOrCorrectResidence(form: any, sectionThreeData?: SectionThreeData) {
  if (!sectionThreeData) return;

  if (sectionThreeData.address && sectionThreeData.address.city) {
    try {
      const cityFields = [
        "city.1.0",
        "city 1.0.1.0",
        "city 1.1.1.0",
        "city 1.2.1.0",
        "city 1.3.1.0",
        "city 1.4.1.0",
        "city 1.5.1.0",
        "city 1.6.1.0",
        "city 1.7.1.0",
        "city 1.8.1.0",
        "city 1.9.1.0",
        "city 1.10.1.0",
        "city 1.11.1.0",
        "city 1.12.1.0",
        "city 1.13.1.0",
        "city 1.14.1.0",
        "city 1.15.1.0",
        "city 1.16.1.0",
        "city 1.17.1.0",
        "city 1.18.1.0",
        "city 1.19.1.0",
        "city 1.20.1.0",

      ];
      
      const city = sectionThreeData.address.city.toUpperCase();
      
      for (let i = 0; i < city.length && i < cityFields.length; i++) {
        const field = form.getTextField(cityFields[i]);
        if (field) {
          field.setText(city.charAt(i));
        }
      }
    } catch (e) {
      console.warn(`Error setting new residence city fields`, e);
    }
  }
    if (sectionThreeData.address && sectionThreeData.address.streetNumber) {
    try {
      const streetNumberFields = [
        "street.1.0",
        "street 1.0.1.0", 
        "street 1.1.1.0",
        "street 1.2.1.0",  
        "street 1.3.1.0",
      ];
      
      const streetNumber = sectionThreeData.address.streetNumber.toUpperCase();
      
      for (let i = 0; i < streetNumber.length && i < streetNumberFields.length; i++) {
        const field = form.getTextField(streetNumberFields[i]);
        if (field) {
          field.setText(streetNumber.charAt(i));
        }
      }
    } catch (e) {
      console.warn(`Error setting new residence street number fields`, e);
    }
  }
  
 
  if (sectionThreeData.address && sectionThreeData.address.aptNo) {
    try {
      const aptNumberFields = [
        "apt number.0.1.0",
        "apt number.1.0.1.0",
        "apt number.1.1.1.0",
        "apt number.1.2.1.0",
      ];
      
      const aptNo = sectionThreeData.address.aptNo.toUpperCase();
      
      for (let i = 0; i < aptNo.length && i < aptNumberFields.length; i++) {
        const field = form.getTextField(aptNumberFields[i]);
        if (field) {
          field.setText(aptNo.charAt(i));
        }
      }
    } catch (e) {
      console.warn(`Error setting new residence apt number fields`, e);
    }
  }
  
 
  if (sectionThreeData.address && sectionThreeData.address.state) {
    try {
      const stateFields = [
        "state 1.1.0",
        "state 2.0",
      ];
      
      const state = sectionThreeData.address.state.toUpperCase();
      
 
      if (state.length === 2) {
        for (let i = 0; i < state.length && i < stateFields.length; i++) {
          const field = form.getTextField(stateFields[i]);
          if (field) {
            field.setText(state.charAt(i));
          }
        }
      }
    } catch (e) {
      console.warn(`Error setting new residence state fields`, e);
    }

    
  }

  if (sectionThreeData.address && sectionThreeData.address.streetName) {
    try {
      const streetNameFields = [
        "street name.1.0",
        "street name 1.0.0.1.0",
        "street name 1.0.1.1.0",
        "street name 1.0.2.1.0",
        "street name 1.0.3.1.0",
        "street name 1.0.4.1.0",
        "street name 1.0.5.1.0",
        "street name 1.0.6.1.0",
        "street name 1.0.7.1.0",
        "street name 1.0.8.1.0",
        "street name 1.0.9.1.0",
        "street name 1.0.10.1.0",

        "street name 1.0.11.1.0",
        "street name 1.0.12.1.0",
        "street name 1.0.13.1.0",
        "street name 1.0.14.1.0",
        "street name 1.0.15.1.0",
        "street name 1.0.16.1.0",
        "street name 1.0.17.1.0",
        "street name 1.0.18.1.0",

        "street name 1.0.19.0.1.0",
        "street name 1.0.19.1.1.0",


        "street name 1.0.20.0.1.0",

      "street name 1.0.20.1.1.0",
      "street name 1.0.20.2.1.0",
      "street name 1.0.20.3.1.0",
      "street name 1.0.20.4.1.0",
      "street name 1.0.20.5.1.0",
      "street name 1.0.20.6.1.0",
      "street name 1.0.20.7.1.0",
      "street name 1.0.20.8.1.0",
      "street name 1.0.20.9.1.0",
      "street name 1.0.20.10.1.0",

      "street name 1.0.20.11.1.0",
      "street name 1.0.20.12.1.0",
      "street name 1.0.20.13.1.0",
      "street name 1.0.20.14.1.0",
      "street name 1.0.20.15.1.0",
      "street name 1.0.20.16.1.0",
      "street name 1.0.20.17.1.0",
      "street name 1.0.20.18.1.0",
      "street name 1.0.20.19.1.0",
      "street name 1.0.20.20.1.0",
      "street name 1.0.20.21.1.0",



      ];
      
      const streetName = sectionThreeData.address.streetName.toUpperCase();
      
      for (let i = 0; i < streetName.length && i < streetNameFields.length; i++) {
        const field = form.getTextField(streetNameFields[i]);
        if (field) {
          field.setText(streetName.charAt(i));
        }
      }
    } catch (e) {
      console.warn(`Error setting new residence street name fields`, e);
    }
  }
  
  if (sectionThreeData.address && sectionThreeData.address.zipCode) {
    try {
      const zipCodeFields = [
        "zip code.0.1.0",
        "zip code.1.0.1.0",
        "zip code.1.1.1.0",
        "zip code.1.2.1.0",
        "zip code.1.3.1.0",
      ];
      
      const cleanZipCode = sectionThreeData.address.zipCode.replace(/[^0-9]/g, '');
      
      for (let i = 0; i < cleanZipCode.length && i < zipCodeFields.length; i++) {
        const field = form.getTextField(zipCodeFields[i]);
        if (field) {
          field.setText(cleanZipCode.charAt(i));
        }
      }
    } catch (e) {
      console.warn(`Error setting new residence zip code fields`, e);
    }
  }
  
  if (sectionThreeData.mailingAddressDifferent && 
    sectionThreeData.mailingAddress && 
    sectionThreeData.mailingAddress.city) {
  try {
    const mailingCityFields = [
      "city.1.1.0",
      "city 1.0.1.1.0",
      "city 1.1.1.1.0",
      "city 1.2.1.1.0",
      "city 1.3.1.1.0",
      "city 1.4.1.1.0",
      "city 1.5.1.1.0",
      "city 1.6.1.1.0",
      "city 1.7.1.1.0",
      "city 1.8.1.1.0",
      "city 1.9.1.1.0",
      "city 1.10.1.1.0",
      "city 1.11.1.1.0",
      "city 1.12.1.1.0",
      "city 1.13.1.1.0",
      "city 1.14.1.1.0",
      "city 1.15.1.1",
      "city 1.16.1.1",
      "city 1.17.1.1",
      "city 1.18.1.1",
      "city 1.19.1.1",
      "city 1.19.1.1",
      "city 1.20.1.1",

      
    ];
    
    const mailingCity = sectionThreeData.mailingAddress.city.toUpperCase();
    
    for (let i = 0; i < mailingCity.length && i < mailingCityFields.length; i++) {
      const field = form.getTextField(mailingCityFields[i]);
      if (field) {
        field.setText(mailingCity.charAt(i));
      }
    }
  } catch (e) {
    console.warn(`Error setting mailing address city fields`, e);
  }
} 


if (sectionThreeData.mailingAddressDifferent && 
  sectionThreeData.mailingAddress && 
  sectionThreeData.mailingAddress.streetName) {
try {
  const streetNameFields = [
    "street name.1.1.0",
    "street name 1.0.0.1.1.0",
    "street name 1.0.1.1.1.0",
    "street name 1.0.2.1.1.0",
    "street name 1.0.3.1.1.0",
    "street name 1.0.4.1.1.0",
    "street name 1.0.5.1.1.0",
    "street name 1.0.6.1.1.0",
    "street name 1.0.7.1.1.0",
    "street name 1.0.8.1.1.0",
    "street name 1.0.9.1.1.0",
    "street name 1.0.10.1.1.0",
    "street name 1.0.11.1.1.0",
    "street name 1.0.12.1.1.0",
    "street name 1.0.13.1.1.0",
    "street name 1.0.14.1.1.0",
    "street name 1.0.15.1.1.0",
    "street name 1.0.16.1.1.0",
    "street name 1.0.17.1.1.0",
    "street name 1.0.18.1.1.0",
    "street name 1.0.19.0.1.1.0",
    "street name 1.0.19.1.1.1.0",
    "street name 1.0.20.0.1.1",
    "street name 1.0.20.1.1.1",
    "street name 1.0.20.2.1.1",
    "street name 1.0.20.3.1.1",
    "street name 1.0.20.4.1.1",
    "street name 1.0.20.5.1.1",
    "street name 1.0.20.6.1.1",
    "street name 1.0.20.7.1.1",
    "street name 1.0.20.8.1.1",
    "street name 1.0.20.9.1.1",
    "street name 1.0.20.10.1.1",
    "street name 1.0.20.11.1.1",
    "street name 1.0.20.12.1.1",
    "street name 1.0.20.13.1.1",
    "street name 1.0.20.14.1.1",
    "street name 1.0.20.15.1.1",
    "street name 1.0.20.16.1.1",
    "street name 1.0.20.17.1.1",
    "street name 1.0.20.18.1.1",
    "street name 1.0.20.19.1.1",
    "street name 1.0.20.20.1.1",
    "street name 1.0.20.21.1.1",
   

  
  ];
  
  const streetName = sectionThreeData.mailingAddress.streetName.toUpperCase();
  
  for (let i = 0; i < streetName.length && i < streetNameFields.length; i++) {
    const field = form.getTextField(streetNameFields[i]);
    if (field) {
      field.setText(streetName.charAt(i));
    }
  }
} catch (e) {
  console.warn(`Error setting mailing address street name fields`, e);
}
}
if (sectionThreeData.mailingAddressDifferent && 
      sectionThreeData.mailingAddress && 
      sectionThreeData.mailingAddress.streetNumber) {
    try {
      const mailingStreetNumberFields = [
        "street.1.1.0",
        "street 1.0.1.1.0",
        "street 1.1.1.1.0",
        "street 1.2.1.1.0",
        "street 1.3.1.1.0",
      ];
      
      const mailingStreetNumber = sectionThreeData.mailingAddress.streetNumber.toUpperCase();
      
      for (let i = 0; i < mailingStreetNumber.length && i < mailingStreetNumberFields.length; i++) {
        const field = form.getTextField(mailingStreetNumberFields[i]);
        if (field) {
          field.setText(mailingStreetNumber.charAt(i));
        }
      }
    } catch (e) {
      console.warn(`Error setting mailing address street number fields`, e);
    }
  }
  
 
  if (sectionThreeData.mailingAddressDifferent && 
      sectionThreeData.mailingAddress && 
      sectionThreeData.mailingAddress.aptNo) {
    try {
      const mailingAptNumberFields = [
        "apt number.0.1.1",
        "apt number.1.0.1.1",
        "apt number.1.1.1.1",
        "apt number.1.2.1.1",
      ];
      
      const mailingAptNo = sectionThreeData.mailingAddress.aptNo.toUpperCase();
      
      for (let i = 0; i < mailingAptNo.length && i < mailingAptNumberFields.length; i++) {
        const field = form.getTextField(mailingAptNumberFields[i]);
        if (field) {
          field.setText(mailingAptNo.charAt(i));
        }
      }
    } catch (e) {
      console.warn(`Error setting mailing address apt number fields`, e);
    }
  }
  
 
  if (sectionThreeData.mailingAddressDifferent && 
      sectionThreeData.mailingAddress && 
      sectionThreeData.mailingAddress.state) {
    try {
      const mailingStateFields = [
        "state 2.1.0",
        "state 2.1.1",
      ];
      
      const mailingState = sectionThreeData.mailingAddress.state.toUpperCase();
      
 
      if (mailingState.length === 2) {
        for (let i = 0; i < mailingState.length && i < mailingStateFields.length; i++) {
          const field = form.getTextField(mailingStateFields[i]);
          if (field) {
            field.setText(mailingState.charAt(i));
          }
        }
      }
    } catch (e) {
      console.warn(`Error setting mailing address state fields`, e);
    }
  }
  
  if (sectionThreeData.mailingAddressDifferent && 
    sectionThreeData.mailingAddress && 
    sectionThreeData.mailingAddress.zipCode) {
  try {
    const mailingZipCodeFields = [
      "zip code.0.1.1",
      "zip code.1.0.1.1",
      "zip code.1.1.1.1",
      "zip code.1.2.1.1",
      "zip code.1.3.1.1",
    ];
    
    const cleanMailingZipCode = sectionThreeData.mailingAddress.zipCode.replace(/[^0-9]/g, '');
    
    for (let i = 0; i < cleanMailingZipCode.length && i < mailingZipCodeFields.length; i++) {
      const field = form.getTextField(mailingZipCodeFields[i]);
      if (field) {
        field.setText(cleanMailingZipCode.charAt(i));
      }
    }
  } catch (e) {
    console.warn(`Error setting mailing address zip code fields`, e);
  }
}

if (sectionThreeData.hasTrailerVessel && 
  sectionThreeData.trailerVesselAddress && 
  sectionThreeData.trailerVesselAddress.streetName) {
try {
  const streetNameFields = [ "street name.1.1.1", "street name 1.0.0.1.1.1", "street name 1.0.1.1.1.1", "street name 1.0.2.1.1.1", "street name 1.0.3.1.1.1", "street name 1.0.4.1.1.1", "street name 1.0.5.1.1.1", "street name 1.0.6.1.1.1", "street name 1.0.7.1.1.1", "street name 1.0.8.1.1.1", "street name 1.0.9.1.1.1", "street name 1.0.10.1.1.1", "street name 1.0.11.1.1.1", "street name 1.0.12.1.1.1", "street name 1.0.13.1.1.1", "street name 1.0.14.1.1.1", "street name 1.0.15.1.1.1", "street name 1.0.16.1.1.1", "street name 1.0.17.1.1.1", "street name 1.0.18.1.1.1", "street name 1.0.19.0.1.1.1", "street name 1.0.19.1.1.1.1" ];
  
  const streetName = sectionThreeData.trailerVesselAddress.streetName.toUpperCase();
  
  for (let i = 0; i < streetName.length && i < streetNameFields.length; i++) {
    const field = form.getTextField(streetNameFields[i]);
    if (field) {
      field.setText(streetName.charAt(i));
    }
  }
} catch (e) {
  console.warn(`Error setting trailer/vessel address street name fields`, e);
}
}
if (sectionThreeData.hasTrailerVessel && 
  sectionThreeData.trailerVesselAddress && 
  sectionThreeData.trailerVesselAddress.city) {
try {
  const trailerVesselCityFields = [
    "city.1.1.1.0",
    "city 1.0.1.1.1.0",
    "city 1.1.1.1.1.0",
    "city 1.2.1.1.1.0",
    "city 1.3.1.1.1.0",
    "city 1.4.1.1.1.0",
    "city 1.5.1.1.1.0",
    "city 1.6.1.1.1.0",
    "city 1.7.1.1.1.0",
    "city 1.8.1.1.1.0",
    "city 1.9.1.1.1.0",
    "city 1.10.1.1.1.0",
    "city 1.11.1.1.1.0",
    "city 1.12.1.1.1.0",
    "city 1.13.1.1.1.0",
    "city 1.14.1.1.1.0",
  ];
  
  const trailerVesselCity = sectionThreeData.trailerVesselAddress.city.toUpperCase();
  
  for (let i = 0; i < trailerVesselCity.length && i < trailerVesselCityFields.length; i++) {
    const field = form.getTextField(trailerVesselCityFields[i]);
    if (field) {
      field.setText(trailerVesselCity.charAt(i));
    }
  }
} catch (e) {
  console.warn(`Error setting trailer/vessel address city fields`, e);
}

if (sectionThreeData.hasTrailerVessel && 
  sectionThreeData.trailerVesselAddress && 
  sectionThreeData.trailerVesselAddress.county) {
try {
  const countyFields = [
    "county.0",
    "county.1",
    "county.2",
    "county.3",
    "county.4",
    "county.5",
    "county.6",
    "county.7",
    "county.8",
    "county.9",
    "county.10",
    "county.11",
    "county.12",
    "county.13"
  ];
  
  const county = sectionThreeData.trailerVesselAddress.county.toUpperCase();
  
  for (let i = 0; i < county.length && i < countyFields.length; i++) {
    const field = form.getTextField(countyFields[i]);
    if (field) {
      field.setText(county.charAt(i));
    }
  }
} catch (e) {
  console.warn(`Error setting trailer/vessel address county fields`, e);
}
}
}  if (sectionThreeData.hasTrailerVessel && 
      sectionThreeData.trailerVesselAddress && 
      sectionThreeData.trailerVesselAddress.streetNumber) {
    try {
      const trailerVesselStreetNumberFields = [
        "street.1.1.1",
        "street 1.0.1.1.1",
        "street 1.1.1.1.1",
        "street 1.2.1.1.1",
        "street 1.3.1.1.1",
      ];
      
      const trailerVesselStreetNumber = sectionThreeData.trailerVesselAddress.streetNumber.toUpperCase();
      
      for (let i = 0; i < trailerVesselStreetNumber.length && i < trailerVesselStreetNumberFields.length; i++) {
        const field = form.getTextField(trailerVesselStreetNumberFields[i]);
        if (field) {
          field.setText(trailerVesselStreetNumber.charAt(i));
        }
      }
    } catch (e) {
      console.warn(`Error setting trailer/vessel address street number fields`, e);
    }
  }
  
 
}

