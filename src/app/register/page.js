import { Suspense } from "react";

import { AuthCard } from "@/components/auth/auth-card";
import { RegisterForm } from "@/components/auth/register-form";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Create your account — KindCircle",
  description:
    "Join KindCircle to create, join and track community service events near you.",
};

function RegisterFormSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-hidden="true">
      {[0, 1, 2, 3].map((item) => (
        <div key={item} className="flex flex-col gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-11 w-full" />
        </div>
      ))}
      <Skeleton className="mt-2 h-11 w-full" />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create your account"
      description="Join KindCircle and turn good intentions into shared action in your neighbourhood."
    >
      <Suspense fallback={<RegisterFormSkeleton />}>
        <RegisterForm />
      </Suspense>
    </AuthCard>
  );
}
