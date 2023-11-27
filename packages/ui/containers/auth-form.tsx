'use client';

import { Loader2, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '../components/button';
import { Input } from '../components/input';
import { Label } from '../components/label';

import LabeledDivider from './labeled-divider';

import { signInWithGoogle } from '@mcsph/supabase/ops/auth/providers';

export default function AuthForm({
  formAction,
  processing,
}: {
  formAction: ((formData: FormData) => Promise<void>) | undefined;
  processing?: boolean;
}) {
  return (
    <div className="grid gap-3">
      <form action={formAction}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="john.doe@company.com"
              type="email"
              name="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              required
            />
          </div>

          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="••••••••••••••••••"
              type="password"
              autoCapitalize="none"
              name="password"
              autoComplete="off"
              autoCorrect="off"
            />
          </div>

          <Button type="submit" name="Proceed with login" disabled={processing}>
            {processing ? (
              <Loader2 className="mr-2 animate-spin" size={18} />
            ) : (
              <Mail className="mr-2" size={18} />
            )}
            Sign in with Email
          </Button>
          <Button asChild variant="link" className="my-0 py-0">
            <Link
              href="/reset-password"
              prefetch={false}
              aria-disabled={processing}
            >
              {processing && (
                <Loader2 className="mr-2 animate-spin" size={18} />
              )}
              <span className={processing ? 'text-muted-foreground' : ''}>
                Forgot your password?
              </span>
            </Link>
          </Button>
        </div>
      </form>

      <LabeledDivider className="mb-2 mt-1" text="or continue with" />

      {/* Additional login types */}
      <Button
        variant="outline"
        type="button"
        onClick={() => signInWithGoogle()}
        disabled={processing}
      >
        {processing ? (
          <Loader2 className="mr-2 animate-spin" size={18} />
        ) : (
          <Image
            className="mr-2"
            width={20}
            height={20}
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCA0OCA0OCI+CjxwYXRoIGZpbGw9IiNGRkMxMDciIGQ9Ik00My42MTEsMjAuMDgzSDQyVjIwSDI0djhoMTEuMzAzYy0xLjY0OSw0LjY1Ny02LjA4LDgtMTEuMzAzLDhjLTYuNjI3LDAtMTItNS4zNzMtMTItMTJjMC02LjYyNyw1LjM3My0xMiwxMi0xMmMzLjA1OSwwLDUuODQyLDEuMTU0LDcuOTYxLDMuMDM5bDUuNjU3LTUuNjU3QzM0LjA0Niw2LjA1MywyOS4yNjgsNCwyNCw0QzEyLjk1NSw0LDQsMTIuOTU1LDQsMjRjMCwxMS4wNDUsOC45NTUsMjAsMjAsMjBjMTEuMDQ1LDAsMjAtOC45NTUsMjAtMjBDNDQsMjIuNjU5LDQzLjg2MiwyMS4zNSw0My42MTEsMjAuMDgzeiI+PC9wYXRoPjxwYXRoIGZpbGw9IiNGRjNEMDAiIGQ9Ik02LjMwNiwxNC42OTFsNi41NzEsNC44MTlDMTQuNjU1LDE1LjEwOCwxOC45NjEsMTIsMjQsMTJjMy4wNTksMCw1Ljg0MiwxLjE1NCw3Ljk2MSwzLjAzOWw1LjY1Ny01LjY1N0MzNC4wNDYsNi4wNTMsMjkuMjY4LDQsMjQsNEMxNi4zMTgsNCw5LjY1Niw4LjMzNyw2LjMwNiwxNC42OTF6Ij48L3BhdGg+PHBhdGggZmlsbD0iIzRDQUY1MCIgZD0iTTI0LDQ0YzUuMTY2LDAsOS44Ni0xLjk3NywxMy40MDktNS4xOTJsLTYuMTktNS4yMzhDMjkuMjExLDM1LjA5MSwyNi43MTUsMzYsMjQsMzZjLTUuMjAyLDAtOS42MTktMy4zMTctMTEuMjgzLTcuOTQ2bC02LjUyMiw1LjAyNUM5LjUwNSwzOS41NTYsMTYuMjI3LDQ0LDI0LDQ0eiI+PC9wYXRoPjxwYXRoIGZpbGw9IiMxOTc2RDIiIGQ9Ik00My42MTEsMjAuMDgzSDQyVjIwSDI0djhoMTEuMzAzYy0wLjc5MiwyLjIzNy0yLjIzMSw0LjE2Ni00LjA4Nyw1LjU3MWMwLjAwMS0wLjAwMSwwLjAwMi0wLjAwMSwwLjAwMy0wLjAwMmw2LjE5LDUuMjM4QzM2Ljk3MSwzOS4yMDUsNDQsMzQsNDQsMjRDNDQsMjIuNjU5LDQzLjg2MiwyMS4zNSw0My42MTEsMjAuMDgzeiI+PC9wYXRoPgo8L3N2Zz4="
            alt="Google Icon"
            priority={true}
          />
        )}
        Sign In with Google
      </Button>
    </div>
  );
}
