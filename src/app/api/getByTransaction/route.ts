import connectDB from '@/lib/mongoDB';
import Client from '@/models/clientSchema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const transactionType = searchParams.get('transactionType');
  const user_id = searchParams.get('user_id');

  try {
    if (!transactionType) {
      return NextResponse.json({ error: 'Transaction parameter is required' }, { status: 400 });
    }

    if (!user_id) {
      return NextResponse.json({ error: 'User parameter is required' }, { status: 400 });
    }

    const clients = await Client.find({
      user_id: user_id,
      transactionType: transactionType,
    });

    if (clients.length === 0) {
      return NextResponse.json({ error: 'No clients found for the specified transaction' });
    }
    return NextResponse.json(clients);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
