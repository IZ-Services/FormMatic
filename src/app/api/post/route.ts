import connectDB from '@/lib/mongoDB';
import Client from '@/models/clientSchema';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  connectDB();

  try {
    const reqBody = await request.json();
    const {
      firstName1,
      middleName1,
      lastName1,
      licenseNumber1,
      and1,
      or1,
      firstName2,
      middleName2,
      lastName2,
      licenseNumber2,
      and2,
      or2,
      firstName3,
      middleName3,
      lastName3,
      licenseNumber3,
      residentualAddress,
      residentualAptSpace,
      residentualCity,
      residentualState,
      residentualZipCode,
      mailingAddress,
      mailingPoBox,
      mailingCity,
      mailingState,
      mailingZipCode,
      vehicleVinNumber,
      vehicleLicensePlateNumber,
      vehicleMake,
      vehicleSaleMonth,
      vehicleSaleDay,
      vehicleSaleYear,
      vehiclePurchasePrice,
      gift,
      trade,
      transactionType,
    } = reqBody;

    const newClient = new Client({
      firstName1,
      middleName1,
      lastName1,
      licenseNumber1,
      and1,
      or1,
      firstName2,
      middleName2,
      lastName2,
      licenseNumber2,
      and2,
      or2,
      firstName3,
      middleName3,
      lastName3,
      licenseNumber3,
      residentualAddress,
      residentualAptSpace,
      residentualCity,
      residentualState,
      residentualZipCode,
      mailingAddress,
      mailingPoBox,
      mailingCity,
      mailingState,
      mailingZipCode,
      vehicleVinNumber,
      vehicleLicensePlateNumber,
      vehicleMake,
      vehicleSaleMonth,
      vehicleSaleDay,
      vehicleSaleYear,
      vehiclePurchasePrice,
      gift,
      trade,
      transactionType,
      timeCreated: new Date().toISOString(),
    });
    const savedClient = await newClient.save();

    return NextResponse.json({
      message: 'User created successfully',
      sucess: true,
      savedClient,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
