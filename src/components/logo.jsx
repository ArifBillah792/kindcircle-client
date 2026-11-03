import Link from "next/link";
import { HeartHandshake } from "lucide-react";

import { cn } from "@/lib/utils";

export function Logo({ className, href = "/" }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
        <HeartHandshake className="size-5" aria-hidden="true" />
      </span>
      <span className="font-heading text-xl font-semibold tracking-tight text-foreground">
        KindCircle
      </span>
    </Link>
  );
}
