import connectDB from '@/lib/mongoDB';
import Client from '@/models/clientSchema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  await connectDB();
  try {
    const { searchParams } = new URL(request.url);
    const selectedDate = searchParams.get('date');

    if (!selectedDate) {
      return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 });
    }

    const startOfDay = new Date(selectedDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const clients = await Client.find({
      timeCreated: {
        $gte: startOfDay,
        $lte: endOfDay
      },
    }).sort({ timeCreated: -1 });

    if (clients.length === 0) {
      return NextResponse.json({ error: 'No clients found for the specified date' });
    }
    return NextResponse.json(clients);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
