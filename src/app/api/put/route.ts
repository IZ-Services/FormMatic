import connectDB from '@/lib/mongoDB';
import { NextRequest, NextResponse } from 'next/server';
import Client from '@/models/clientSchema';

export async function PUT(request: NextRequest) {
  try {
    connectDB();

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const updatedData = await request.json();

    await Client.findByIdAndUpdate(clientId, updatedData, { new: true });

    return NextResponse.json({ message: 'Successfully updated' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
