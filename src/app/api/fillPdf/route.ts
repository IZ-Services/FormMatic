import connectDB from '@/lib/mongoDB';
import TransactionModel from '../../../models/transaction';
import { NextResponse } from 'next/server';
import { PDFDocument, PDFName, PDFBool } from 'pdf-lib';
import {  StandardFonts, rgb } from 'pdf-lib';
import VehicleTransactionDetails from '@/components/atoms/Checkboxes';

export async function POST(request: Request) {
  try {
    await connectDB();

    const requestData = await request.json();
    const { transactionId, formType = 'Reg227' } = requestData;

    if (!transactionId) {
      return NextResponse.json({ error: 'Transaction ID is required.' }, { status: 400 });
    }

    const transaction = await TransactionModel.findById(transactionId);
    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found.' }, { status: 404 });
    }

    console.log('Transaction data:', JSON.stringify({
      id: transaction._id,
      type: transaction.transactionType,
      isMultiple: transaction.isPartOfMultipleTransfer,
      index: transaction.transferIndex,
      total: transaction.totalTransfers
    }));

    let formData = transaction.formData;

    const isMultipleTransfer = transaction.isPartOfMultipleTransfer === true || 
                            transaction.transactionType?.includes('Multiple Transfer') ||
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
          itemRequested: {}
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
          itemRequested: {}
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
    

    formData.mailingAddressDifferent = !!formData.mailingAddressDifferent;
    formData.lesseeAddressDifferent = !!formData.lesseeAddressDifferent;
    formData.trailerLocationDifferent = !!formData.trailerLocationDifferent;
    formData.sellerMailingAddressDifferent = !!formData.sellerMailingAddressDifferent;

    console.log("After restructuring:");
    console.log('- owners exists:', !!formData.owners);
    console.log('- vehicleInformation exists:', !!formData.vehicleInformation);
    console.log('- vehicleTransactionDetails exists:', !!formData.vehicleTransactionDetails);
    console.log('- legalOwnerInformation exists:', !!formData.legalOwnerInformation);
    console.log('- mailingAddressDifferent:', formData.mailingAddressDifferent);
    console.log('- lesseeAddressDifferent:', formData.lesseeAddressDifferent);
    console.log('- trailerLocationDifferent:', formData.trailerLocationDifferent);
    console.log('- sellerMailingAddressDifferent:', formData.sellerMailingAddressDifferent);
    console.log('- sellerAddress exists:', Object.keys(formData.sellerAddress).length > 0 ? true : false);
    console.log('- sellerAddress keys:', Object.keys(formData.sellerAddress));
    console.log('- sellerMailingAddress exists:', Object.keys(formData.sellerMailingAddress).length > 0 ? true : false);
    console.log('- sellerMailingAddress keys:', Object.keys(formData.sellerMailingAddress));
    console.log('- itemRequested exists:', Object.keys(formData.itemRequested).length > 0 ? true : false);

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
      } else {
        modifiedPdfBytes = await modifyReg227Pdf(existingPdfBytes, formData, transaction.transactionType);
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
      } else {
        modifiedPdfBytes = await modifyReg227Pdf(existingPdfBytes, formData, transaction.transactionType);
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
    
    applicationDate: 'application_date_field',
    
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
    individualAddedBox: 'Individual(s) being added as registered owner(s).*'
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
  
 
  const sellerInfo = formData.sellerInfo || {};
  const sellers = sellerInfo.sellers || [];
  const seller1SaleDate = sellers.length > 0 ? sellers[0].saleDate || '' : '';
  const formattedSeller1SaleDate = formatDate(seller1SaleDate);
  
 
  console.log(`Using seller's sale date for all date fields: ${formattedSeller1SaleDate}`);
  
  const ownerInfo = formData.ownerInfo || {};
  const owner = ownerInfo.owner || {};
  const vehicleInfo = formData.vehicleInformation || {};
  const addressData = formData.address || {};
  
  const isGift = formData.vehicleTransactionDetails?.isGift === true;
  const isFamilyTransfer = formData.vehicleTransactionDetails?.isFamilyTransfer === true;
  const isSmogExempt = formData.vehicleTransactionDetails?.isSmogExempt === true;
  
  console.log(`Transaction type: ${isGift ? 'Gift' : isFamilyTransfer ? 'Family Transfer' : isSmogExempt ? 'Smog Exempt' : 'Other'}`);
  
  if (Object.keys(owner).length > 0) {
    const ownerName = [
      owner.firstName?.trim() || '',
      owner.middleName?.trim() || '',
      owner.lastName?.trim() || ''
    ].filter(Boolean).join(' ');
  }
  
  const owners = formData.owners || [];
  if (Array.isArray(owners) && owners.length > 0) {
    const newRegOwner = owners[0];
    
    safeSetText(fieldMapping.ownerLastName, newRegOwner.lastName || '');
    safeSetText(fieldMapping.ownerFirstName, newRegOwner.firstName || '');
    safeSetText(fieldMapping.ownerMiddleName, newRegOwner.middleName || '');
    
    const phoneNumber = newRegOwner.phoneNumber || '';
    const { areaCode, mainNumber } = formatPhone(phoneNumber);
    safeSetText(fieldMapping.ownerPhoneAreaCode, areaCode);
    safeSetText(fieldMapping.ownerPhoneNumber, mainNumber);
    
    if (isGift && newRegOwner.marketValue) {
      safeSetText(fieldMapping.currentMarketValue, newRegOwner.marketValue.toString());
      console.log(`Set market value to: ${newRegOwner.marketValue}`);
    }
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
  
 
  if (seller1SaleDate) {
    safeSetText(fieldMapping.applicationDate, formattedSeller1SaleDate);
    safeSetText(fieldMapping.signatureDate, formattedSeller1SaleDate);
    console.log(`Set application and signature dates to seller's sale date: ${formattedSeller1SaleDate}`);
  }
  
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


async function modifyReg156Pdf(fileBytes: ArrayBuffer, formData: any): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
  
  const form = pdfDoc.getForm();
  
  const fieldNames = form.getFields().map(f => f.getName());
  console.log('Available Reg156 PDF Fields:', JSON.stringify(fieldNames, null, 2));
  
  console.log('===== COMPLETE FORM DATA =====');
  console.log(JSON.stringify(formData, null, 2));
  console.log('=============================');
  
  let transactionType = null;
  
  if (formData.transactionType) {
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
  } else {
    transactionType = "Duplicate Registration Transfer";
    console.log(`No transaction type found anywhere, using default: "Duplicate Registration Transfer"`);
  }
  
  formData.transactionType = transactionType;
  
  const isDuplicateStickers = transactionType === "Duplicate Stickers";
  const isDuplicatePlatesAndStickers = transactionType === "Duplicate Plates & Stickers";
  const isDuplicateTitleTransfer = transactionType === "Duplicate Title Transfer";
  const isDuplicateRegistrationTransfer = transactionType === "Duplicate Registration Transfer";
  
  console.log(`Transaction type: "${transactionType}", isDuplicateStickers: ${isDuplicateStickers}, isDuplicatePlatesAndStickers: ${isDuplicatePlatesAndStickers}, isDuplicateTitleTransfer: ${isDuplicateTitleTransfer}, isDuplicateRegistrationTransfer: ${isDuplicateRegistrationTransfer}`);
  
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
    "Two plates": "licensePlate.twoMissingPlates" 
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
  }
  
 
  if (!isDuplicateRegistrationTransfer) {
    for (const [pdfField, formField] of Object.entries(checkboxMapping)) {
      try {
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
        
        if (pdfField === "other") {
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
  
  if (isDuplicateStickers) {
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