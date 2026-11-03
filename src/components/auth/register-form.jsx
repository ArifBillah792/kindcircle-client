"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Image as ImageIcon, Loader2, Lock, Mail, User } from "lucide-react";

import { signUp } from "@/lib/auth-client";
import { getSafeRedirect } from "@/lib/redirect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const registerSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  photoURL: z
    .string()
    .trim()
    .min(1, "Photo URL is required")
    .url("Enter a valid URL, for example https://example.com/photo.jpg"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/[a-z]/, "Password must include at least one lowercase letter"),
});

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = getSafeRedirect(searchParams.get("redirect"));
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", photoURL: "", password: "" },
  });

  async function onSubmit(values) {
    setServerError("");

    const { error } = await signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      image: values.photoURL,
    });

    if (error) {
      const message =
        error.message || "We could not create your account. Please try again.";
      setServerError(message);
      toast.error(message);
      return;
    }

    toast.success("Welcome to KindCircle!");
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Full name</Label>
        <div className="relative">
          <User
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id="name"
            type="text"
            placeholder="Ayesha Rahman"
            autoComplete="name"
            className="h-11 pl-9"
            aria-invalid={Boolean(errors.name)}
            {...register("name")}
          />
        </div>
        {errors.name ? (
          <p role="alert" className="text-sm text-destructive">
            {errors.name.message}
          </p>
        ) : null}
      </div>

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
        <Label htmlFor="photoURL">Photo URL</Label>
        <div className="relative">
          <ImageIcon
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id="photoURL"
            type="url"
            placeholder="https://example.com/your-photo.jpg"
            autoComplete="photo"
            className="h-11 pl-9"
            aria-invalid={Boolean(errors.photoURL)}
            {...register("photoURL")}
          />
        </div>
        {errors.photoURL ? (
          <p role="alert" className="text-sm text-destructive">
            {errors.photoURL.message}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Paste a public link to a photo of you.
          </p>
        )}
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
            placeholder="Create a password"
            autoComplete="new-password"
            className="h-11 pl-9"
            aria-invalid={Boolean(errors.password)}
            {...register("password")}
          />
        </div>
        {errors.password ? (
          <p role="alert" className="text-sm text-destructive">
            {errors.password.message}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            At least 6 characters, with one uppercase and one lowercase letter.
          </p>
        )}
      </div>

      {serverError ? (
        <p
          role="alert"
          className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {serverError}
        </p>
      ) : null}

      <Button type="submit" className="mt-2 h-11 w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Creating account...
          </>
        ) : (
          "Create account"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already part of KindCircle?{" "}
        <Link
          href={
            redirectTo === "/"
              ? "/login"
              : `/login?redirect=${encodeURIComponent(redirectTo)}`
          }
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}
