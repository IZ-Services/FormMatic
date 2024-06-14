import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const url = request.url.toLowerCase();

  if (url.includes('login') || url.includes('forgotpassword')) {
    requestHeaders.set('x-auth-page', 'true');
  } else {
    requestHeaders.set('x-auth-page', 'false');
  }
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
