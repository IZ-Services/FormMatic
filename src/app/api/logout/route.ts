import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth } from '@/lib/firebaseAdmin';
import { removeSession } from '@/lib/sessionmanager';

export async function POST() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('sessionId')?.value;
  const sessionCookie = cookieStore.get('session')?.value;

  if (sessionCookie && sessionId) {
    try {
      const decodedClaims = await auth.verifySessionCookie(sessionCookie);
      await removeSession(decodedClaims.uid, sessionId);
    } catch (error) {
      console.error('Error removing session:', error);
    }
  }

  const response = NextResponse.json({ success: true });
  
  // Clear cookies
  response.cookies.set('session', '', { maxAge: 0, path: '/' });
  response.cookies.set('sessionId', '', { maxAge: 0, path: '/' });
  
  return response;
}