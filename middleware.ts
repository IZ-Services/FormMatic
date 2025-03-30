import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateSessionCookie } from './sessionValidation';


const publicPaths = ['/', '/login', '/register', '/reset-password'];

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value;
  const sessionId = request.cookies.get('sessionId')?.value;
  const { pathname } = request.nextUrl;
  

  const isPublicPath = publicPaths.includes(pathname);
  

  if (isPublicPath) {
    return NextResponse.next();
  }
  

  if (!sessionCookie || !sessionId) {
    const url = new URL('/', request.url);
    return NextResponse.redirect(url);
  }
  
  try {

    const validSession = await validateSessionCookie(sessionCookie, sessionId);
    
    if (!validSession) {

      const url = new URL('/', request.url);
      return NextResponse.redirect(url);
    }
    

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);

    const url = new URL('/', request.url);
    return NextResponse.redirect(url);
  }
}


export const config = {
  matcher: [

    '/((?!_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};