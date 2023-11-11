import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AlertCircle, Boxes, Wifi } from "lucide-react";
import { Logger } from "next-axiom";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

import Announcements from "@/components/announcements";
import AuthForm, { type AuthFormProps } from "@/components/auth-form";
import ThemeSwitcher from "@/components/theme-switcher";

import { createClient } from "@/utils/supabase/server";
import { defaultUrl } from "@/utils";

export default async function Index({
  searchParams,
}: {
  searchParams: { title: string; message: string };
}) {
  const authActions: AuthFormProps = {
    googleAction: googleSignIn,
    formAction: formSignIn,
    forgotAction: forgotAction,
  };

  return (
    <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Left-side panel */}
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />

        {/* Branding */}
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Boxes className="mr-2" size={26} />
          Company A
        </div>

        {/*
        TODO: Show public-facing/non-sensitive announcement
              Ex. System Updates, Maintenance, etc.
        */}
        <div className="relative z-20 mt-10">
          <Announcements />
        </div>
      </div>

      {/* Right-side panel */}
      <div className="lg:p-8">
        <div className="absolute top-10 right-10 z-20 flex items-center">
          <ThemeSwitcher />
        </div>

        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <SystemStatus />

            <h1 className="text-2xl font-semibold tracking-tight">
              Good to see you!
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials below to login.
            </p>
          </div>

          {/* Invalid Credentials Alert */}
          {searchParams?.message && (
            <Alert variant="destructive" className="text-left text-sm">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{searchParams.title}</AlertTitle>
              <AlertDescription>{searchParams.message}</AlertDescription>
            </Alert>
          )}

          <AuthForm {...authActions} />
        </div>
      </div>
    </div>
  );
}

const SystemStatus = async () => {
  // Check if we can communicate with the database
  const canInitSupabaseClient = async () => {
    try {
      const cookieStore = cookies();
      createClient(cookieStore);
      return true;
    } catch (e) {
      return false;
    }
  };

  const isSupabaseConnected = await canInitSupabaseClient();

  return (
    <Badge
      variant="outline"
      className="w-fit p-1 px-5 text-center mx-auto mb-2 mt-auto"
    >
      {isSupabaseConnected ? (
        <>
          <Wifi className="mr-2" size={20} color="#4fff38" />
          All systems normal
        </>
      ) : (
        <>
          <Wifi className="mr-2" size={20} color="#ff3838" />
          System downtime
        </>
      )}
    </Badge>
  );
};

const googleSignIn = async () => {
  "use server";
  const cookieStore = cookies();
  const log = new Logger();

  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });

  if (error) {
    log.info("Google login failed attempt", { error: error });
    await log.flush();

    return redirect(
      "?title=Something went wrong&message=You may have used the wrong google account.",
    );
  }

  return redirect("/dashboard");
};

const formSignIn = async (formData: FormData) => {
  "use server";
  const cookieStore = cookies();
  const log = new Logger();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    log.info("User login failed attempt", { email: email, error: error });
    await log.flush();

    return redirect(
      "?title=Invalid Credentials&message=Wrong username or password.",
    );
  }

  return redirect("/dashboard");
};

const forgotAction = async () => {
  "use server";
  const cookieStore = cookies();
  const log = new Logger();

  const supabase = createClient(cookieStore);

  // TODO: Update password action
  //       https://supabase.com/docs/guides/auth/auth-password-reset#update-password
  const { error } = await supabase.auth.resetPasswordForEmail("", {
    redirectTo: `${defaultUrl}/auth/callback?next=/profile/reset-password`,
  });

  if (error) {
    log.info("Error reset password request", { email: "TODO", error: error });
    await log.flush();

    return redirect(
      "?title=Something went wrong&message=Contact your IT Administrator for troubleshooting.",
    );
  }

  log.info("Password reset requested", { email: "TODO" });
  await log.flush();
};
