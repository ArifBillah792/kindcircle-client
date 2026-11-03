"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Lock, Mail } from "lucide-react";

import { signIn } from "@/lib/auth-client";
import { getSafeRedirect } from "@/lib/redirect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

function GitHubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 4.97 3.22 9.18 7.69 10.67.56.1.77-.24.77-.54 0-.27-.01-1.16-.02-2.1-3.13.68-3.79-1.33-3.79-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.63 1.22 3.27.93.1-.72.39-1.22.71-1.5-2.5-.28-5.13-1.25-5.13-5.57 0-1.23.44-2.23 1.16-3.02-.12-.28-.5-1.43.11-2.98 0 0 .95-.3 3.1 1.15a10.8 10.8 0 0 1 5.64 0c2.15-1.45 3.1-1.15 3.1-1.15.61 1.55.23 2.7.11 2.98.72.79 1.16 1.79 1.16 3.02 0 4.33-2.64 5.29-5.15 5.56.4.35.76 1.03.76 2.08 0 1.5-.01 2.71-.01 3.08 0 .3.2.65.78.54a11.26 11.26 0 0 0 7.68-10.67C23.25 5.48 18.27.5 12 .5Z" />
    </svg>
  );
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = getSafeRedirect(searchParams.get("redirect"));
  const [serverError, setServerError] = useState("");
  const [isGithubLoading, setIsGithubLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values) {
    setServerError("");

    const { error } = await signIn.email({
      email: values.email,
      password: values.password,
    });

    if (error) {
      const message =
        error.message || "We could not sign you in. Please try again.";
      setServerError(message);
      toast.error(message);
      return;
    }

    toast.success("Welcome back to KindCircle!");
    router.push(redirectTo);
    router.refresh();
  }

  async function handleGithubSignIn() {
    setServerError("");
    setIsGithubLoading(true);

    const { error } = await signIn.social({
      provider: "github",
      callbackURL: redirectTo,
    });

    // On success BetterAuth sends the browser to GitHub, so this only runs
    // when something went wrong.
    if (error) {
      const message =
        error.message || "GitHub sign-in failed. Please try again.";
      setServerError(message);
      toast.error(message);
      setIsGithubLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className="h-11 pl-9"
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
            />
          </div>
          {errors.email ? (
            <p role="alert" className="text-sm text-destructive">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="password"
              type="password"
              placeholder="Your password"
              autoComplete="current-password"
              className="h-11 pl-9"
              aria-invalid={Boolean(errors.password)}
              {...register("password")}
            />
          </div>
          {errors.password ? (
            <p role="alert" className="text-sm text-destructive">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        {serverError ? (
          <p
            role="alert"
            className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {serverError}
          </p>
        ) : null}

        <Button
          type="submit"
          className="mt-2 h-11 w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Signing in...
            </>
          ) : (
            "Log in"
          )}
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="shrink-0 text-xs uppercase tracking-wide text-muted-foreground">
          or
        </span>
        <Separator className="flex-1" />
      </div>

      <Button
        type="button"
        variant="outline"
        className="h-11 w-full"
        onClick={handleGithubSignIn}
        disabled={isGithubLoading}
      >
        {isGithubLoading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <GitHubIcon className="size-4" />
        )}
        Continue with GitHub
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        New to KindCircle?{" "}
        <Link
          href={
            redirectTo === "/"
              ? "/register"
              : `/register?redirect=${encodeURIComponent(redirectTo)}`
          }
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
