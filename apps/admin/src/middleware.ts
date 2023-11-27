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

  const isNotLogin = !req.nextUrl.pathname.startsWith('/login');
  const isNotAuthCallback = !req.nextUrl.pathname.startsWith('/auth');

  // check if user is logged in, except when making auth calbacks
  if (!session && isNotLogin && isNotAuthCallback) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // if there is a session but user is trying to access login page
  // redirect to dashboard
  if (session && !isNotLogin) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (session) {
    const isNotInternalEmail = !session?.user?.email?.endsWith('@tip.edu.ph');
    const isNotAdmin = session?.user?.user_metadata?.role !== 'Admin';
    const isNotStaff = session?.user?.user_metadata?.role !== 'Staff';

    // destroy session and redirect to login if user is not admin or staff
    // or if user is not using an internal email (if google auth is used)
    if (isNotAdmin && isNotStaff && isNotInternalEmail) {
      await supabase.auth.signOut();

      return NextResponse.redirect(
        new URL(
          '/login?title=Unauthorized Access&message=Contact an IT Personnel if this is a mistake.',
          req.url,
        ),
      );
    }
  }

  return response;
});
