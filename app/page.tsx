import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AlertCircle, Boxes } from "lucide-react";

import { AuthForm } from "@/components/auth-form";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { createClient } from "@/utils/supabase/server";

export function Announcements() {
  return (
    <div className="relative z-20 mt-10">
      <blockquote className="space-y-2">
        <h2 className="text-2xl font-semibold">Announcments</h2>
        <p className="text-lg">
          &ldquo;This library has saved me countless hours of work and helped me
          deliver stunning designs to my clients faster than ever before.&rdquo;
        </p>
        <footer className="text-sm">Sofia Davis</footer>
      </blockquote>
    </div>
  );
}

export default async function Index({
  searchParams,
}: {
  searchParams: { title: string; message: string };
}) {
  const cookieStore = cookies();

  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect(
        "?title=Invalid Credentials&message=Wrong username or password.",
      );
    }

    return redirect("/");
  };

  const canInitSupabaseClient = () => {
    try {
      createClient(cookieStore);
      return true;
    } catch (e) {
      return false;
    }
  };
  const isSupabaseConnected = canInitSupabaseClient();

  return (
    <>
      <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />

          {/* Branding */}
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Boxes className="mr-2" size={26} />
            Company A
          </div>

          <Announcements />
        </div>

        <div className="lg:p-8">
          {/* Branding */}
          <div className="absolute top-10 right-10 z-20 flex items-center">
            <ThemeSwitcher />
          </div>

          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Good to see you!
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your credentials below to login.
              </p>
            </div>

            {/* Invalid Crednetials Alert */}
            {searchParams?.message && (
              <Alert variant="destructive" className="text-left text-sm">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{searchParams.title}</AlertTitle>
                <AlertDescription>{searchParams.message}</AlertDescription>
              </Alert>
            )}

            <AuthForm action={signIn} />
          </div>
        </div>
      </div>
    </>
  );
}
