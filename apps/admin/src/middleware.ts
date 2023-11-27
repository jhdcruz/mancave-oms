import { NextResponse } from 'next/server';
import { AxiomRequest, withAxiom } from 'next-axiom';
import { middlewareClient } from '@mcsph/supabase/lib/middleware';

const PUBLIC_FILE = /\.(.*)$/;

export const middleware = withAxiom(async (req: AxiomRequest) => {
  const { pathname } = req.nextUrl;
  const { supabase, response } = middlewareClient(req);

  // fixes hydration errors when using redirect in middleware
  // https://github.com/vercel/next.js/discussions/38587
  if (
    pathname.startsWith('/_next') || // exclude Next.js internals
    pathname.startsWith('/api') || //  exclude all API routes
    pathname.startsWith('/static') || // exclude static files
    PUBLIC_FILE.test(pathname) // exclude all files in the public folder
  ) {
    return NextResponse.next();
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // check if user is logged in
  if (!session && !req.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // check if user has admin role (if google auth is used)
  if (
    !req.nextUrl.pathname.startsWith('/login') &&
    session?.user?.role !== 'Admin'
  ) {
    // destroy logged-in session
    await supabase.auth.signOut();
    return NextResponse.redirect(
      new URL(
        '/login?title=Unauthorized Access&message=Contact an IT Personnel if this is a mistake.',
        req.url,
      ),
    );
  }

  return response;
});
