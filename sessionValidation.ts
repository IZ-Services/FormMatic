
import { auth } from '@/lib/firebaseAdmin';
import { validateSession } from '@/lib/sessionmanager';

export async function validateSessionCookie(
  sessionCookie: string,
  sessionId: string
): Promise<boolean> {
  try {

    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    
    if (!decodedClaims.uid) {
      return false;
    }
    

    const isValid = await validateSession(decodedClaims.uid, sessionId);
    return isValid;
  } catch (error) {
    console.error('Session validation error:', error);
    return false;
  }
}