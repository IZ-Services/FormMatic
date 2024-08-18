import connectDB from '@/lib/mongoDB';
import Client from '@/models/clientSchema';
import { NextRequest, NextResponse } from 'next/server';
import { UserAuth } from '../../../context/AuthContext'; 

export async function GET(request: NextRequest) {
  await connectDB();
  
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');

    if (!user_id) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }


  try {
    const clients = await Client.find({ user_id }).sort({ timeCreated: -1 });

    if (clients.length === 0) {
      return NextResponse.json({ error: 'No clients found' }, { status: 404 });
    }

    return NextResponse.json(clients);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
