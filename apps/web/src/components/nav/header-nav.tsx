'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import {
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@mcsph/ui/components/navigation-menu';

import MainNav from '@mcsph/ui/containers/main-nav';

import routes, {
  externalRoutes,
  type RouteProps,
} from '@/components/nav/routes';
import { Session } from '@mcsph/supabase';
import {
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@mcsph/ui/components/command';
import { ExternalLink } from 'lucide-react';

export default function HeaderNav({ session }: { session: Session | null }) {
  return (
    <MainNav
      mainRoutes={<MainRoutes session={session} />}
      extRoutes={externalRoutes.map((route) => (
        <NavigationMenuItem key={route.href}>
          <Link href={route.href} target="_blank" passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              {route.title}
              <ExternalLink className="ml-2" size={12} />
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      ))}
      commands={<Commands />}
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
    return routes.map((route: RouteProps) => (
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
    return routes
      .filter((route: RouteProps) => route.trigger !== 'Admin')
      .map((route: RouteProps) => (
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

const Commands = () => {
  const router = useRouter();

  const runCommand = useCallback((command: () => unknown) => {
    command();
  }, []);

  return (
    <>
      {routes.map((route: RouteProps) => (
        <CommandGroup key={route.href} heading={route.trigger}>
          <CommandItem
            onSelect={() => runCommand(() => router.push(route.href))}
          >
            {route.icon}
            <span>{route.name}</span>
          </CommandItem>

          {route.actions?.map((subroute) => (
            <CommandItem
              key={subroute.href}
              onSelect={() => runCommand(() => router.push(subroute.href))}
            >
              {route.icon}
              <span>{subroute.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      ))}

      <CommandSeparator />
    </>
  );
};
