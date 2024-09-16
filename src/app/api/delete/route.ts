import connectDB from '@/lib/mongoDB';
import Client from '@/models/clientSchema';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
  await connectDB();

  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const user_id = searchParams.get('user_id');

    if (!clientId || !user_id) {
      return NextResponse.json({ error: 'clientId and user_id are required' }, { status: 400 });
    }

    const client = await Client.findOne({ _id: clientId, user_id: user_id });

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found or you do not have permission to delete this client' },
        { status: 404 },
      );
    }

    await Client.findByIdAndDelete(clientId);

    return NextResponse.json({ message: 'Client successfully deleted' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
