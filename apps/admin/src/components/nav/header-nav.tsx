'use client';

import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

import {
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@mcsph/ui/components/navigation-menu';

import MainNav from './main-nav';

import type {
  CommandActionProps,
  CommandProps,
} from '@mcsph/ui/containers/search-command';
import { externalRoutes, mainRoutes } from '@/components/nav/routes';
import { Session } from '@mcsph/supabase/types';

export default function HeaderNav({ session }: { session: Session | null }) {
  // Google logins does not return first_name and last_name
  const getSessionName = (): string => {
    if (session?.user?.user_metadata?.first_name) {
      return (
        session?.user?.user_metadata?.first_name +
        ' ' +
        session?.user?.user_metadata?.last_name
      );
    } else {
      return session?.user?.user_metadata?.name;
    }
  };

  return (
    <MainNav
      mainRoutes={<MainRoutes session={session} />}
      extRoutes={<ExternalRoutes session={session} />}
      commands={Commands({ session })}
      user={{
        avatar: session?.user?.user_metadata?.avatar_url,
        name: getSessionName(),
        email: session?.user?.email,
      }}
    />
  );
}

const Commands = ({ session }: { session: Session | null }) => {
  if (session?.user?.user_metadata?.role === 'Admin') {
    return mainRoutes;
  } else {
    return mainRoutes.filter(
      (route: CommandProps) => route.trigger !== 'Admin',
    );
  }
};

const MainRoutes = ({ session }: { session: Session | null }) => {
  if (session?.user?.user_metadata?.role === 'Admin') {
    return (
      mainRoutes
        // exclude dashboard, the logo takes over the purpose
        .filter((route: CommandProps) => route.trigger !== 'Dashboard')
        .map((route: CommandProps) => (
          <NavigationMenuItem key={route.href}>
            <Link href={route.href} passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                {route.trigger}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))
    );
  } else {
    return (
      mainRoutes
        // Don't show admin routes when user is not admin
        .filter(
          (route: CommandProps) =>
            route.trigger !== 'Dashboard' && route.trigger !== 'Admin',
        )
        .map((route: CommandProps) => (
          <NavigationMenuItem key={route.href}>
            <Link href={route.href} passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                {route.trigger}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))
    );
  }
};

const ExternalRoutes = ({ session }: { session: Session | null }) => {
  if (session?.user?.user_metadata?.role === 'Admin') {
    return externalRoutes.map((route: CommandActionProps) => (
      <NavigationMenuItem key={route.href}>
        <Link href={route.href} target="_blank" prefetch={false} passHref>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            {route.title}
            <ExternalLink className="ml-2" size={12} />
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
    ));
  }
};
