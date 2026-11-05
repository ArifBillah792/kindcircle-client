"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/auth-client";

function validate({ name, email, photoURL, password }) {
  const errors = {};
  if (!name.trim()) errors.name = "Please enter your name";
  if (!email.includes("@") || !email.includes("."))
    errors.email = "Please enter a valid email";
  if (!photoURL.trim().startsWith("http"))
    errors.photoURL = "Photo URL must start with http";

  // Password rules from the assignment
  if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  } else if (password === password.toLowerCase()) {
    errors.password = "Password must have at least one uppercase letter";
  } else if (password === password.toUpperCase()) {
    errors.password = "Password must have at least one lowercase letter";
  }
  return errors;
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const redirectTo = redirect && redirect.startsWith("/") ? redirect : "/";

  const [form, setForm] = useState({
    name: "",
    email: "",
    photoURL: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validate(form);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error(Object.values(newErrors)[0]);
      return;
    }

    setLoading(true);
    const { error } = await signUp.email({
      name: form.name,
      email: form.email,
      password: form.password,
      image: form.photoURL,
    });
    setLoading(false);

    if (error) {
      toast.error(error.message || "Registration failed");
      return;
    }
    toast.success("Welcome to KindCircle!");
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <Card>
      <CardContent className="space-y-5">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-semibold">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Join KindCircle and turn good intentions into shared action in your
            neighbourhood.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ayesha Rahman"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="photoURL">Photo URL</Label>
            <Input
              id="photoURL"
              name="photoURL"
              value={form.photoURL}
              onChange={handleChange}
              placeholder="https://example.com/your-photo.jpg"
            />
            {errors.photoURL && (
              <p className="text-sm text-destructive">{errors.photoURL}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create a password"
            />
            {errors.password ? (
              <p className="text-sm text-destructive">{errors.password}</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                At least 6 characters, with one uppercase and one lowercase
                letter.
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="size-4 animate-spin" />}
            Create account
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already part of KindCircle?{" "}
          <Link
            href={`/login?redirect=${redirectTo}`}
            className="font-medium text-primary hover:underline"
          >
            Log in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function RegisterPage() {
  return (
    <section className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <Logo />
        </div>
        {/* useSearchParams needs a Suspense wrapper in Next.js */}
        <Suspense>
          <RegisterForm />
        </Suspense>
      </div>
    </section>
  );
}
