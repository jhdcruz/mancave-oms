import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AlertCircle, Boxes, Wifi } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import Announcements from "@/components/Announcements";
import AuthForm from "@/components/auth-form";

import { createClient } from "@/utils/supabase/server";

const ThemeSwitcher = dynamic(() => import("@/components/theme-switcher"), {
  ssr: false,
});

export default async function Index({
  searchParams,
}: {
  searchParams: { title: string; message: string };
}) {
  const cookieStore = cookies();

  const canInitSupabaseClient = async () => {
    try {
      createClient(cookieStore);
      return true;
    } catch (e) {
      return false;
    }
  };
  const isSupabaseConnected = await canInitSupabaseClient();

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

            {/* Check if there is back-end connection */}
            <Badge
              variant="outline"
              className="w-fit p-1 px-5 text-center mx-auto mb-5 mt-auto"
            >
              {isSupabaseConnected ? (
                <>
                  <Wifi className="mr-2" size={20} color="#4fff38" />
                  All systems normal
                </>
              ) : (
                <>
                  <Wifi className="mr-2" size={20} color="#ff3838" />
                  System under maintenance
                </>
              )}
            </Badge>
          </div>
        </div>
      </div>
    </>
  );
}
