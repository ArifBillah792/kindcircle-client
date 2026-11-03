"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, LogOut } from "lucide-react";

import { signOut, useSession } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function getInitials(name) {
  const initials = (name || "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return initials || "KC";
}

export function SessionStatus() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  if (isPending) {
    return (
      <div className="flex w-full max-w-lg items-center gap-3 rounded-2xl border bg-card/70 px-5 py-4 shadow-sm">
        <Skeleton className="size-10 shrink-0 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-44" />
        </div>
      </div>
    );
  }

  const user = session?.user;

  if (!user) {
    return (
      <div className="flex w-full max-w-lg flex-col items-center gap-3 rounded-2xl border bg-card/70 px-5 py-4 text-sm shadow-sm sm:flex-row sm:justify-between">
        <p className="text-muted-foreground">
          Join in and make a difference where you live.
        </p>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Register</Link>
          </Button>
        </div>
      </div>
    );
  }

  async function handleSignOut() {
    setIsSigningOut(true);

    const { error } = await signOut();

    if (error) {
      toast.error(error.message || "We could not sign you out. Please try again.");
      setIsSigningOut(false);
      return;
    }

    toast.success("Signed out. See you at the next event.");
    router.refresh();
    setIsSigningOut(false);
  }

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-3 rounded-2xl border bg-card/70 px-5 py-4 shadow-sm sm:flex-row">
      <Avatar className="size-10">
        <AvatarImage
          src={user.image || undefined}
          alt={user.name ? `${user.name}'s photo` : "KindCircle member"}
        />
        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1 text-center sm:text-left">
        <p className="truncate text-sm">
          <span className="text-muted-foreground">Logged in as </span>
          <span className="font-medium">{user.name}</span>
        </p>
        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
      </div>

      <Button
        variant="outline"
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="shrink-0"
      >
        {isSigningOut ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <LogOut className="size-4" aria-hidden="true" />
        )}
        Sign out
      </Button>
    </div>
  );
}
