import { NextResponse } from 'next/server';
import { AxiomRequest, withAxiom } from 'next-axiom';
import { middlewareClient } from '@mcsph/supabase';

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

  // check if user is logged in before accessing profile
  if (req.nextUrl.pathname.startsWith('/profile') && !session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return response;
});
