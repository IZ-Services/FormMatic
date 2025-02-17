import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebaseAdmin';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('session')?.value;


        if (!sessionCookie) {
            console.warn('No session cookie found');
            return NextResponse.json({ user: null });
        }

        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        console.log('Session verified:', decodedClaims);

        return NextResponse.json({ user: decodedClaims });
    } catch (error) {
        console.error('Session verification failed:', error);
        return NextResponse.json({ user: null });
    }
}