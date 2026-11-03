"use client";

import { Mail } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  function handleSubmit(e) {
    e.preventDefault();
    toast.success("Thank you for subscribing to KindCircle updates!");
    e.target.reset();
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12">
      <div className="pointer-events-none absolute -left-16 -bottom-16 size-64 rounded-full bg-terracotta/30 blur-3xl" />
      <Mail className="relative mx-auto mb-4 size-10" />
      <h2 className="relative font-heading text-3xl font-semibold sm:text-4xl">
        Never miss a chance to help
      </h2>
      <p className="relative mx-auto mt-3 max-w-xl text-primary-foreground/80">
        Get a monthly note with new events near you and stories from the
        neighbourhoods we serve together.
      </p>
      <form
        onSubmit={handleSubmit}
        className="relative mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
      >
        <Input
          type="email"
          required
          placeholder="Your email address"
          className="h-11 bg-background text-foreground"
        />
        <Button type="submit" size="lg" variant="secondary" className="h-11">
          Subscribe
        </Button>
      </form>
    </div>
  );
}
