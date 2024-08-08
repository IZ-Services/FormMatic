import connectDB from '@/lib/mongoDB';
import Client from '@/models/clientSchema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const start = searchParams.get('start');
  const end = searchParams.get('end');
  try {

    if (!start || !end) {
      return NextResponse.json({ error: 'Start and end date parameters are required' }, { status: 400 });
    }

    const clients = await Client.find({
      timeCreated: {
        $gte: new Date(start),
        $lte: new Date(end)
      }
    }).sort({ timeCreated: -1 });

    if (clients.length === 0) {
      return NextResponse.json({ error: 'No clients found for the specified date range' });
    }
    return NextResponse.json(clients);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
