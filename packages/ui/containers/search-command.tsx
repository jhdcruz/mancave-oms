'use client';

import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';

import { LaptopIcon, MoonIcon, SunIcon, User } from 'lucide-react';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '../components/command';
import { Button } from '../components/button';

import { cn } from '@mcsph/utils';

/**
 * Subroutes for the main `CommandProps`
 */
export type CommandActionProps = {
  href: string;
  title: string;
  description: string;
  external?: boolean;
};

export type CommandProps = {
  trigger: string;
  icon: ReactNode;
  icon_button?: ReactNode;
  name: string;
  description: string;
  href: string;
  actions?: CommandActionProps[];
};

export default function SearchCommandDialog({
  commands,
  ...props
}: {
  commands: CommandProps[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { setTheme } = useTheme();

  useEffect(() => {
    // handles search command visibility on shortcut key ctrl + k
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          'relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64',
        )}
        onClick={() => setOpen(true)}
        {...props}
      >
        <span className="lg:inline-flex">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="item text-xs">⌘</span>K
        </kbd>
      </Button>

      {/* Command */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>
            <span className="text-muted">No results found.</span>
          </CommandEmpty>

          {commands.map((route: CommandProps) => (
            <CommandGroup key={route.href} heading={route.trigger}>
              <CommandItem
                onSelect={() => runCommand(() => router.push(route.href))}
              >
                {route.icon}
                <span>{route.name}</span>
              </CommandItem>

              {route.actions?.map((subroute: CommandActionProps) => (
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

          <CommandGroup heading="Settings">
            <CommandItem
              onSelect={() => runCommand(() => router.push('/profile'))}
            >
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push('/logout'))}
            >
              <User className="mr-2 h-4 w-4" />
              <span>Log Out</span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Theme Settings">
            <CommandItem onSelect={() => runCommand(() => setTheme('light'))}>
              <SunIcon className="mr-2 h-4 w-4" />
              Light
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('dark'))}>
              <MoonIcon className="mr-2 h-4 w-4" />
              Dark
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('system'))}>
              <LaptopIcon className="mr-2 h-4 w-4" />
              System
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
