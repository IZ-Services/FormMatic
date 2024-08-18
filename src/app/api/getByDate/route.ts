import connectDB from '@/lib/mongoDB';
import Client from '@/models/clientSchema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const start = searchParams.get('start');
  const end = searchParams.get('end');
  const user_id = searchParams.get('user_id'); 

  try {

    if (!start || !end || !user_id) {
      return NextResponse.json({ error: 'Start, end date, and user_id parameters are required' }, { status: 400 });
    }

    const clients = await Client.find({
      user_id: user_id, 
      timeCreated: {
        $gte: new Date(start),
        $lte: new Date(end)
      }
    }).sort({ timeCreated: -1 });

    if (clients.length === 0) {
      return NextResponse.json({ error: 'No clients found for the specified date range' });
    }
    return NextResponse.json(clients, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
