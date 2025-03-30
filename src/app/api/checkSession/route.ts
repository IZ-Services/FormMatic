import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebaseAdmin';
import { validateSession } from '@/lib/sessionmanager';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {

    const referer = request.headers.get('referer') || '';
    const refererUrl = new URL(referer);
    const refererPath = refererUrl.pathname;
    
    console.log('checkSession called from path:', refererPath);
    
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    const sessionId = cookieStore.get('sessionId')?.value;

    if (!sessionCookie || !sessionId) {
      console.log('No session or sessionId cookie found');
      return NextResponse.json({ user: null, path: refererPath });
    }
  
    try {
      const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
      
      if (!decodedClaims.uid) {
        console.log('No UID in decoded claims');
        return NextResponse.json({ user: null, path: refererPath });
      }

      const isValid = await validateSession(decodedClaims.uid, sessionId);
      if (!isValid) {
        console.log(`Session ${sessionId} is no longer valid`);
        return NextResponse.json({ user: null, path: refererPath });
      }
  
      return NextResponse.json({ 
        user: decodedClaims, 
        path: refererPath 
      });
    } catch (error) {
      console.error('Session verification failed:', error);
      return NextResponse.json({ user: null, path: refererPath });
    }
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ user: null, path: null });
  }
}