import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoDB'; 
import TransactionModel from '../../../models/transaction'; 

export async function POST(request: Request) {
  await connectDB();

  const { userId, transactionType, formData } = await request.json();

  if (!userId || !transactionType || !formData) {
    return NextResponse.json(
      { error: 'userId, transactionType, and formData are required.' },
      { status: 400 }
    );
  }

  try {
    const transaction = new TransactionModel({
      userId,
      transactionType,
      formData,
    });
    await transaction.save();

    return NextResponse.json(
      { message: 'Transaction saved successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving transaction:', error);
    return NextResponse.json(
      { error: 'Internal server error. Could not save transaction.' },
      { status: 500 }
    );
  }
}
