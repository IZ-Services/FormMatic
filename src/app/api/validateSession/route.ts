import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth } from '@/lib/firebaseAdmin';
import { validateSession } from '@/lib/sessionmanager';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    const sessionId = cookieStore.get('sessionId')?.value;

    if (!sessionCookie || !sessionId) {
      return NextResponse.json({ valid: false });
    }

    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const isValid = await validateSession(decodedClaims.uid, sessionId);

    return NextResponse.json({ valid: isValid });
  } catch (error) {
    console.error('Session validation error:', error);
    return NextResponse.json({ valid: false });
  }
}