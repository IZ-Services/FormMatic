import connectDB from '@/lib/mongoDB';
import Transaction from '@/models/transaction';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const start = searchParams.get('start');
  const end = searchParams.get('end');
  const userId = searchParams.get('userId');

  if (!start || !end || !userId) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    const transactions = await Transaction.find({
      userId,
      createdAt: { $gte: new Date(start), $lte: new Date(end) },
    }).sort({ createdAt: -1 });

    if (!transactions.length) {
      return NextResponse.json({ error: 'No transactions found' }, { status: 404 });
    }

    return NextResponse.json(transactions);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
