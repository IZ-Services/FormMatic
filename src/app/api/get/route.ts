import connectDB from '@/lib/mongoDB';
import Client from '@/models/clientSchema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  await connectDB();
  try {
    const { searchParams } = new URL(request.url);
    let searchFor = searchParams.get('searchFor');


    if (!searchFor) {
      return;
    }
    searchFor = searchFor.replace(/[.*+?^${}()|[\]     s\\]/g, '\\$&');

    const searchRegex = new RegExp(searchFor, 'i');
    const client = await Client.find({
      $or: [
        { firstName1: { $regex: searchRegex } },
        { lastName1: { $regex: searchRegex } },
        { vehicleVinNumber: { $regex: searchRegex } },
        { firstName2: { $regex: searchRegex } },
        { lastName2: { $regex: searchRegex } },
        { firstName3: { $regex: searchRegex } },
        { lastName3: { $regex: searchRegex } },
      ],
    });

    if (client.length === 0) {
      return NextResponse.json({ error: 'Client not found' });
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
