import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebaseAdmin';

export async function POST(req: Request) {
    try {
        const { token } = await req.json();
        console.log('🎟️ Received token in login API');
        
        if (!token) {
            console.error('❌ No token provided');
            return NextResponse.json({ error: 'Missing token' }, { status: 400 });
        }

        const decodedToken = await auth.verifyIdToken(token);
        console.log('✅ Token verified for user:', decodedToken.uid);

        const sessionCookie = await auth.createSessionCookie(token, { expiresIn: 7 * 24 * 60 * 60 * 1000 }); 

        const cookieOptions = {
            name: 'session',
            value: sessionCookie,
            maxAge: 7 * 24 * 60 * 60,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'lax' as const
        };

        const response = NextResponse.json(
            { success: true, uid: decodedToken.uid },
            { status: 200 }
        );

        response.cookies.set(cookieOptions);
        
        console.log('🍪 Session cookie set with options:', cookieOptions);
        
        return response;
    } catch (error) {
        console.error('❌ Login API error:', error);
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
}