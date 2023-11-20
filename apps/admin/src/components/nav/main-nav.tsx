import { ReactNode } from 'react';

import { Boxes } from 'lucide-react';

import {
  NavigationMenu,
  NavigationMenuList,
} from '../components/navigation-menu';
import type { CommandProps } from '@mcsph/ui/containers/search-command';

import UserNav, { UserNavProps } from './user-nav';
import SearchCommandDialog from './search-command';
import ThemeSwitcher from './theme-switcher';

export type NavProps = {
  commands: CommandProps;
  user: UserNavProps;
  mainRoutes: ReactNode | Iterable<ReactNode>;
  extRoutes?: ReactNode | Iterable<ReactNode>;
};

export default function MainNav({
  user,
  commands,
  mainRoutes,
  extRoutes,
}: NavProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <NavigationMenu className="mx-auto max-w-full flex flex-auto items-center space-x-4">
          <div className="text-md flex items-center font-medium">
            <Boxes className="mr-2" size={24} />
            Man Cave Supplies PH, Inc.
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
            <UserNav {...user} />
          </div>
        </NavigationMenu>
      </div>
    </header>
  );
}
