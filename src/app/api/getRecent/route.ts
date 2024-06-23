import connectDB from '@/lib/mongoDB';
import Client from '@/models/clientSchema';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectDB();
  try {
    const clients = await Client.find({}).sort({ timeCreated: -1 });

    if (clients.length === 0) {
      return NextResponse.json({ error: 'No clients found' }, { status: 404 });
    }

    return NextResponse.json(clients);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
