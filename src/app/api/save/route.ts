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
    const savedTransaction = await transaction.save();

    return NextResponse.json(
      { message: 'Transaction saved successfully!',
        transactionId: savedTransaction._id,
       },
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


export async function GET(request: Request) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const transactionId = searchParams.get('transactionId');

  if (!userId && !transactionId) {
    return NextResponse.json(
      { error: 'Either userId or transactionId is required to fetch transactions.' },
      { status: 400 }
    );
  }

  try {
    let query = {};
    if (userId) {
      query = { userId };
    }
    if (transactionId) {
      query = { _id: transactionId };
    }

    const transactions = await TransactionModel.find(query);

    if (transactions.length === 0) {
      return NextResponse.json(
        { message: 'No transactions found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { transactions },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Internal server error. Could not fetch transactions.' },
      { status: 500 }
    );
  }}


  