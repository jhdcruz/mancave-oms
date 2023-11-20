'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { Boxes, UserCircle } from 'lucide-react';

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

export type NavProps = {
  commands: CommandProps[];
  mainRoutes: ReactNode | Iterable<ReactNode>;
  extRoutes?: ReactNode | Iterable<ReactNode>;
};

export default function HeaderNav() {
  return (
    <MainNav
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

const MainNav = ({ commands, mainRoutes, extRoutes }: NavProps) => (
  <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="container flex h-16 items-center px-4">
      <NavigationMenu className="mx-auto flex max-w-full flex-auto items-center space-x-4">
        <div className="text-md flex items-center font-medium">
          <Boxes className="mr-2" size={24} />
          Man Cave Supplies PH, Inc.
        </div>

        <NavigationMenuList className="mr-auto flex items-center">
          {mainRoutes}
        </NavigationMenuList>

        <div className="mx-10 flex grow"></div>

        <div className="ml-auto flex items-center space-x-2">
          <NavigationMenuList className="flex">{extRoutes}</NavigationMenuList>

          <SearchCommandDialog commands={commands} />
          <ThemeSwitcher />
          <UserCircle size={20} />
        </div>
      </NavigationMenu>
    </div>
  </header>
);
