import { serverClient } from '@mcsph/supabase/lib/server';
import { Button } from '@mcsph/ui/components/button';
import { Input } from '@mcsph/ui/components/input';
import { Logger } from 'next-axiom';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import Image from 'next/image';
import { Separator } from '@mcsph/ui/components/separator';

export default async function ResetPage() {
  const resetPassword = async (formData: FormData) => {
    'use server';

    const log = new Logger();

    const newPassword = formData.get('password') as string;

    if (newPassword.trim()) {
      const cookieStore = cookies();
      const supabase = serverClient(cookieStore);

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        log.error('Error password reset action', { error });
      } else {
        NextResponse.redirect('/login');
      }
    }
  };

  return (
    <div className="container mx-auto flex h-screen place-items-center items-center justify-center">
      <form
        className="border-1 flex h-max w-max flex-col items-center justify-center rounded-lg border p-10 shadow"
        action={resetPassword}
      >
        <div className="w-full">
          <Image
            className="mx-auto"
            src="/image.png"
            width={80}
            height={80}
            alt=""
          />

          <Separator className="my-2 w-[95%]" />
        </div>

        <label htmlFor="password" className="my-3 text-lg font-semibold">
          Reset Password
        </label>

        <Input
          id="password"
          name="password"
          type="password"
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          placeholder="••••••••••••••••••"
        />

        <Button type="submit" className="mt-3 w-full">
          Submit
        </Button>
      </form>
    </div>
  );
}
