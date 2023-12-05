import { NextResponse } from 'next/server';
import { AxiomRequest, withAxiom } from 'next-axiom';

import { middlewareClient } from '@mcsph/supabase/lib/middleware';
import { getCurrentUserRole } from '@mcsph/supabase/ops/user';

const PUBLIC_FILE = /\.(.*)$/;

export const middleware = withAxiom(async (req: AxiomRequest) => {
  const { pathname } = req.nextUrl;
  const { supabase, response } = middlewareClient(req);

  const isLogin = pathname.startsWith('/login');
  const isAuthCallback = pathname.startsWith('/auth');

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

  if (session) {
    // for initial google oauth logins,
    // normally, this should be set as a trigger and function in supabase
    // but shit's running out of time to learn plpgsql.
    if (!session?.user?.user_metadata?.role) {
      // get the role of the user in the employees table
      const { data } = await getCurrentUserRole(session?.user?.id, supabase);

      // update the user's role in the restricted auth.users table
      await supabase.auth.updateUser({
        data: {
          role: data?.role,
        },
      });

      // force refresh the session
      await supabase.auth.refreshSession();
      await supabase.auth.getSession();
    }

    const isNotInternalEmail = !session?.user?.email?.endsWith('@tip.edu.ph');
    const isNotAdmin = session?.user?.user_metadata?.role !== 'Admin';
    const isNotStaff = session?.user?.user_metadata?.role !== 'Staff';
    const isNotActive = session?.user?.user_metadata?.active !== true;

    // destroy session and redirect to login if user is not admin or staff
    // or if user is not using an internal email (if google auth is used)
    if (isNotActive && isNotAdmin && isNotStaff && isNotInternalEmail) {
      await supabase.auth.signOut();

      return NextResponse.redirect(
        new URL(
          '/login?title=Unauthorized Access&message=Contact an IT Personnel if this is a mistake.',
          req.url,
        ),
      );
    }
  } else {
    // redirect to login if there is no session and
    // user is not trying to access login page
    if (!isAuthCallback && !isLogin) {
      console.log('Redirecting to login page');
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return response;
});
