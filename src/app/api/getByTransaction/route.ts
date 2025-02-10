import connectDB from '@/lib/mongoDB';
import Transaction from '@/models/transaction';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const transactionType = searchParams.get('transactionType');
  const userId = searchParams.get('userId');

  try {
    if (!transactionType) {
      return NextResponse.json({ error: 'Transaction parameter is required' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'User parameter is required' }, { status: 400 });
    }

    const transactions = await Transaction.find({
      userId,
      transactionType,
    });

    if (transactions.length === 0) {
      return NextResponse.json({ error: 'No transactions found for the specified type' }, { status: 404 });
    }

    return NextResponse.json(transactions);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
