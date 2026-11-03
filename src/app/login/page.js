import { Suspense } from "react";

import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Log in — KindCircle",
  description: "Log in to KindCircle to manage and join community service events.",
};

function LoginFormSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-hidden="true">
      {[0, 1].map((item) => (
        <div key={item} className="flex flex-col gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-11 w-full" />
        </div>
      ))}
      <Skeleton className="mt-2 h-11 w-full" />
      <Skeleton className="h-11 w-full" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      description="Log in to keep track of the events you have joined and the people you are helping."
    >
      <Suspense fallback={<LoginFormSkeleton />}>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
