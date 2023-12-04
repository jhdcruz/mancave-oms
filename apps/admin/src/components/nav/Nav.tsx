'use client';

import { memo, useEffect, useState } from 'react';
import type { Session } from '@mcsph/supabase/types';
import HeaderNav from './header-nav';
import { browserClient } from '@mcsph/supabase/lib/client';

export default function Nav() {
  const [session, setSession] = useState<Session | null>(null);

  const getSession = async () => {
    const supabase = browserClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    return session;
  };

  useEffect(() => {
    getSession().then((session) => setSession(session));
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <HeaderNav session={session} />
    </header>
  );
}
