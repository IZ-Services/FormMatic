import connectDB from '@/lib/mongoDB';
import Client from '@/models/transaction';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  let searchFor = searchParams.get('searchFor');
  const userId = searchParams.get('userId');
  
  try {
    if (!searchFor || !userId) {
      return NextResponse.json(
        { error: 'Search parameters "searchFor" and "userId" are required' },
        { status: 400 },
      );
    }
    
    searchFor = searchFor.replace(/[.*+?^${}()|[\]\\s]/g, '\\$&');
    const searchRegex = new RegExp(searchFor, 'i');
    
    const transactions = await Client.find({
      userId,
      $or: [
        { transactionType: { $regex: searchRegex } },
        { 'formData.firstName1': { $regex: searchRegex } },
        { 'formData.lastName1': { $regex: searchRegex } },
        { 'formData.vehicleVinNumber': { $regex: searchRegex } },
        { 'formData.firstName2': { $regex: searchRegex } },
        { 'formData.lastName2': { $regex: searchRegex } },
        { 'formData.firstName3': { $regex: searchRegex } },
        { 'formData.lastName3': { $regex: searchRegex } },
      ],
    });

    if (transactions.length === 0) {
      return NextResponse.json(
        { error: 'No transactions found' },
        { status: 404 }
      );
    }

    return NextResponse.json(transactions);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}