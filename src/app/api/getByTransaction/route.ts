import connectDB from '@/lib/mongoDB';
import Client from '@/models/clientSchema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  await connectDB();
  try {
    const { searchParams } = new URL(request.url);
    const transactionType = searchParams.get('transactionType');

    if (!transactionType) {
      return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 });
    }

    const clients = await Client.find({
      $or: [{ transactionType: transactionType }],
    });

    if (clients.length === 0) {
      return NextResponse.json({ error: 'No clients found for the specified date' });
    }
    return NextResponse.json(clients);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
