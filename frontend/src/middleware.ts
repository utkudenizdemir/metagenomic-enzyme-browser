// middleware.ts
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Define your middleware function
import { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });

  // Check if the user is authenticated
  const isAuthenticated = !!token;

  // Allow access to the root path
  const isRootPath = req.nextUrl.pathname === '/';

  // If the user is not authenticated and is trying to access a protected route, redirect to the root
  if (!isAuthenticated && !isRootPath) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // If the user is authenticated and trying to access the root path, you may want to redirect them to another page (e.g., a dashboard)
  // Uncomment the next lines if you want to redirect authenticated users away from the root path
  // if (isAuthenticated && isRootPath) {
  //   return NextResponse.redirect(new URL('/dashboard', req.url));
  // }

  // Proceed with the request
  return NextResponse.next();
}

// Specify paths where this middleware should apply
export const config = {
    matcher: [
      '/landing',
      '/results',
      '/biome',
    ],
  };
