import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebaseAdmin';
import { validateSession } from '@/lib/sessionmanager';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    const sessionId = cookieStore.get('sessionId')?.value;

    if (!sessionCookie || !sessionId) {
      return NextResponse.json({ user: null });
    }
  
    try {
      const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
      
      if (!decodedClaims.uid) {
        return NextResponse.json({ user: null });
      }

      const isValid = await validateSession(decodedClaims.uid, sessionId);
      if (!isValid) {
        console.log(`Session ${sessionId} is no longer valid`);
        return NextResponse.json({ user: null });
      }
  
      return NextResponse.json({ user: decodedClaims });
    } catch (error) {
      console.error('Session verification failed:', error);
      return NextResponse.json({ user: null });
    }
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ user: null });
  }
}