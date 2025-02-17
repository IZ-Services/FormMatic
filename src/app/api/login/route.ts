import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebaseAdmin';
import { v4 as uuidv4 } from 'uuid';
import { handleSessionLimit } from '@/lib/sessionmanager';
import connectDB from '@/lib/mongoDB';

export async function POST(request: Request) {
  await connectDB();

  try {
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json({ success: false, error: 'No token provided' });
    }

    const decodedToken = await auth.verifyIdToken(token);
    const sessionId = uuidv4();
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    const invalidatedSessionIds = await handleSessionLimit(
      decodedToken.uid,
      sessionId,
      userAgent
    );

    const sessionCookie = await auth.createSessionCookie(token, {
      expiresIn: 14 * 24 * 60 * 60 * 1000
    });

    const response = NextResponse.json({ 
      success: true,
      invalidatedSessionIds 
    });
    
    response.cookies.set({
      name: 'session',
      value: sessionCookie,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 14 * 24 * 60 * 60,
      path: '/'
    });

    response.cookies.set({
      name: 'sessionId',
      value: sessionId,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 14 * 24 * 60 * 60,
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Error in login:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}