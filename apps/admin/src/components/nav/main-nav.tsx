import { ReactNode } from 'react';

import { Boxes } from 'lucide-react';

import {
  NavigationMenu,
  NavigationMenuList,
} from '@mcsph/ui/components/navigation-menu';

import SearchCommandDialog, {
  type CommandProps,
} from '@mcsph/ui/containers/search-command';

import UserNav, { UserNavProps } from './user-nav';
import ThemeSwitcher from '@mcsph/ui/containers/theme-switcher';

export type NavProps = {
  commands: CommandProps[];
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
        <NavigationMenu className="mx-auto flex max-w-full flex-auto items-center space-x-4">
          <a href="/" className="text-md flex items-center font-medium">
            <Boxes size={26} />
          </a>

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
