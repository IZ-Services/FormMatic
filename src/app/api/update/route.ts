import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoDB';
import TransactionModel from '../../../models/transaction';

async function handleUpdate(request: Request) {
  await connectDB();

  const { userId, transactionType, formData, transactionId } = await request.json();

  if (!userId || !transactionType || !formData || !transactionId) {
    return NextResponse.json(
      { error: 'All fields are required for update.' },
      { status: 400 }
    );
  }

  try {
    const updatedTransaction = await TransactionModel.findByIdAndUpdate(
      transactionId,
      {
        userId,
        transactionType,
        formData
      },
      { new: true }
    );

    if (!updatedTransaction) {
      return NextResponse.json(
        { error: 'Transaction not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Transaction updated successfully!',
        transactionId: updatedTransaction._id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json(
      { error: 'Internal server error. Could not update transaction.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return handleUpdate(request);
}

export async function PUT(request: Request) {
  return handleUpdate(request);
}