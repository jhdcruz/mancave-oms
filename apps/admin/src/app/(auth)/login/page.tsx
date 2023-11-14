import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import { Logger } from "next-axiom";

import { AlertCircle, Boxes, Wifi } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@erp/ui/components/alert";
import { Badge } from "@erp/ui/components/badge";
import { Skeleton } from "@erp/ui/components/skeleton";

import { Announcements } from "@erp/ui/containers/announcements";
import type { AuthFormProps } from "@erp/ui/containers/auth-form";
import { LabeledDivider } from "@erp/ui/containers/labeled-divider";

import { defaultUrl } from "@erp/utils";
import { serverClient } from "@erp/supabase";

// lazy-load client components
const ThemeSwitcher = dynamic(() => import("@/components/theme-switcher"), {
  ssr: false,
  loading: () => <Skeleton className="h-[2.5rem] w-[2.5rem] rounded-lg" />,
});

const AuthForm = dynamic(() => import("@/components/auth-form"), {
  ssr: false,
  loading: () => {
    return (
      <div className="grid gap-4">
        <div className="grid gap-2">
          <div className="mb-1 grid gap-1">
            <Skeleton className="h-10 rounded-lg" />
            <Skeleton className="h-10 rounded-lg" />

            <Skeleton className="h-10 rounded-lg" />
            <Skeleton className="h-10 rounded-lg" />
          </div>
        </div>

        <LabeledDivider text="or continue with" />

        <Skeleton className="h-10 rounded-lg" />
      </div>
    );
  },
});

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
      <div className="relative hidden h-screen flex-col bg-muted p-10 text-white dark:border-r lg:flex">
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
        <div className="absolute right-10 top-10 z-20 flex items-center">
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
      serverClient(cookieStore);
      return true;
    } catch (e) {
      return false;
    }
  };

  const isSupabaseConnected = await canInitSupabaseClient();

  return (
    <Badge
      variant="outline"
      className="mx-auto mb-2 mt-auto w-fit p-1 px-5 text-center"
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

  const supabase = serverClient(cookieStore);

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });

  if (error) {
    log.with(error).error("Google login failed attempt");
    await log.flush();

    return redirect(
      "/login?title=Something went wrong&message=You may have used the wrong google account.",
    );
  }

  // redirect is automatically handled here
};

const formSignIn = async (formData: FormData) => {
  "use server";
  const cookieStore = cookies();
  const log = new Logger();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = serverClient(cookieStore);

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    log.with(error).info("User login failed attempt", { email: email });
    await log.flush();

    return redirect(
      "/login?title=Invalid Credentials&message=Wrong username or password.",
    );
  }

  return redirect("/");
};

const forgotAction = async () => {
  "use server";
  const cookieStore = cookies();
  const log = new Logger();

  const supabase = serverClient(cookieStore);

  // TODO: Update password action
  //       https://supabase.com/docs/guides/auth/auth-password-reset#update-password
  const { error } = await supabase.auth.resetPasswordForEmail("", {
    redirectTo: `${defaultUrl}/auth?next=/profile/reset-password`,
  });

  if (error) {
    log.with(error).error("Error reset password request", { email: "TODO" });
    await log.flush();

    return redirect(
      "/login?title=Something went wrong&message=Contact your IT Administrator for troubleshooting.",
    );
  }

  log.info("Password reset requested", { email: "TODO" });
  await log.flush();
};
