import connectDB from '@/lib/mongoDB';
import Client from '@/models/clientSchema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  await connectDB();
  try {
    const { searchParams } = new URL(request.url);
    const searchFor = searchParams.get('searchFor');

    const client = await Client.find({
      $or: [
        { firstName1: searchFor },
        { lastName1: searchFor },
        { vehicleVinNumber: searchFor },
        { firstName2: searchFor },
        { lastName2: searchFor },
        { firstName3: searchFor },
        { lastName3: searchFor },
      ],
    });

    if (client.length === 0) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
