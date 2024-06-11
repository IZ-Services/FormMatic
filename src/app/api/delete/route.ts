import connectDB from '@/lib/mongoDB';
import Client from '@/models/clientSchema';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
  await connectDB();

  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    await Client.findByIdAndDelete(clientId);

    return NextResponse.json({ message: 'Client successfully deleted' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
