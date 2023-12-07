'use client';

import { useRouter } from 'next/navigation';
import { LogOut, UserCircle } from 'lucide-react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@mcsph/ui/components/avatar';
import { Button } from '@mcsph/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@mcsph/ui/components/dropdown-menu';

export type UserNavProps = {
  avatar: string | undefined;
  name: string | undefined;
  email: string | undefined;
};

export default function UserNav({ avatar, name, email }: UserNavProps) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatar} alt={email} />
            <AvatarFallback>
              <UserCircle size={20} />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            className="items-center"
            onSelect={() => router.push('/logout')}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
