'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { Boxes, ClipboardSignature } from 'lucide-react';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@mcsph/ui/components/navigation-menu';

import routes, { externalRoutes } from '@/components/nav/routes';
import SearchCommandDialog, {
  type CommandProps,
} from '@mcsph/ui/containers/search-command';
import ThemeSwitcher from '@mcsph/ui/containers/theme-switcher';
import type { Session } from '@mcsph/supabase/types';
import UserNav from '@/components/nav/user-nav';
import { Button } from '@mcsph/ui/components/button';

export type NavProps = {
  commands: CommandProps[];
  mainRoutes: ReactNode | Iterable<ReactNode>;
  extRoutes?: ReactNode | Iterable<ReactNode>;
};

export default function HeaderNav({ session }: { session: Session }) {
  return (
    <MainNav
      session={session}
      mainRoutes={routes.map((route) => (
        <NavigationMenuItem key={route.href}>
          <Link href={route.href} passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              {route.trigger}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      ))}
      extRoutes={externalRoutes.map((route) => (
        <NavigationMenuItem key={route.href}>
          <Link href={route.href} target="_blank" passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              {route.icon_button}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      ))}
      commands={routes}
    />
  );
}

const MainNav = ({
  commands,
  mainRoutes,
  extRoutes,
  session,
}: { session: Session } & NavProps) => {
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <NavigationMenu className="mx-auto flex max-w-full flex-auto items-center space-x-4">
          <div className="text-md flex items-center font-medium">
            <a href="/" className="flex items-center">
              <Boxes className="mr-2" size={24} />
              Man Cave Supplies PH, Inc.
            </a>
          </div>

          <NavigationMenuList className="mr-auto flex items-center">
            {mainRoutes}
          </NavigationMenuList>

          <div className="mx-10 flex grow"></div>

          <div className="ml-auto flex items-center space-x-2">
            <NavigationMenuList className="flex">
              {extRoutes}
            </NavigationMenuList>

            <SearchCommandDialog commands={commands} />

            <ThemeSwitcher />
            {session ? (
              <UserNav
                avatar={session?.user?.user_metadata?.avatar_url}
                name={getSessionName()}
                email={session?.user.email}
              />
            ) : (
              <>
                <Button variant="outline" className="px-5 py-2" asChild>
                  <Link href="/login">Log In</Link>
                </Button>

                <Button className="px-7 py-2" asChild>
                  <Link href="/register">Create an Account</Link>
                </Button>
              </>
            )}
          </div>
        </NavigationMenu>
      </div>
    </header>
  );
};
