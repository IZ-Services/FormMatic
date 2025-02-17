import { NextResponse } from 'next/server';
import { removeSession } from '@/lib/sessionmanager';
import connectDB from '@/lib/mongoDB';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  await connectDB();

  try {
    const { sessionId } = await request.json();
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    if (sessionCookie && sessionId) {
      await removeSession(sessionId);
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set({
      name: 'session',
      value: '',
      maxAge: 0,
      path: '/'
    });

    response.cookies.set({
      name: 'sessionId',
      value: '',
      maxAge: 0,
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' });
  }
}