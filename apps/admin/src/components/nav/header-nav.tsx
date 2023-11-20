'use client';

import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

import {
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@mcsph/ui/components/navigation-menu';

import MainNav from './main-nav';

import type { CommandProps } from '@mcsph/ui/containers/search-command';
import { externalRoutes, mainRoutes } from '@/components/nav/routes';
import { Session } from '@mcsph/supabase';

export default function HeaderNav({ session }: { session: Session | null }) {
  return (
    <MainNav
      mainRoutes={<MainRoutes session={session} />}
      extRoutes={externalRoutes.map((route: CommandProps) => (
        <NavigationMenuItem key={route.href}>
          <Link href={route.href} target="_blank" passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              {route.title}
              <ExternalLink className="ml-2" size={12} />
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      ))}
      commands={mainRoutes}
      user={{
        avatar: session?.user?.user_metadata?.avatar_url,
        name:
          session?.user.user_metadata?.first_name +
          ' ' +
          session?.user.user_metadata?.last_name,
        email: session?.user.email,
      }}
    />
  );
}

const MainRoutes = ({ session }: { session: Session | null }) => {
  if (session?.user?.user_metadata?.role === 'Admin') {
    return mainRoutes.map((route: CommandProps) => (
      <NavigationMenuItem key={route.href}>
        <Link href={route.href} passHref>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            {route.trigger}
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
    ));
  } else {
    // Don't show admin routes when user is not admin
    return mainRoutes
      .filter((route: CommandProps) => route.trigger !== 'Admin')
      .map((route: CommandProps) => (
        <NavigationMenuItem key={route.href}>
          <Link href={route.href} passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              {route.trigger}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      ));
  }
};
