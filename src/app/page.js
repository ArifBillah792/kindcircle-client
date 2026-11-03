import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
      {/* Soft, hopeful background washes built from the design tokens. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--secondary),transparent_60%),radial-gradient(ellipse_at_bottom_right,var(--accent),transparent_55%)]"
      />

      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-terracotta/10 px-4 py-1.5 text-sm font-medium text-terracotta">
        Community service, together
      </span>

      <h1 className="text-5xl font-semibold tracking-tight text-primary sm:text-7xl">
        KindCircle
      </h1>

      <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
        Bringing neighbours together to clean, plant, share and care — one
        community event at a time.
      </p>

      <div className="mt-10 flex items-center gap-3 text-sm text-muted-foreground">
        <span className="size-2.5 rounded-full bg-primary" />
        <span className="size-2.5 rounded-full bg-terracotta" />
        <span className="size-2.5 rounded-full bg-accent" />
        <span>Phase 1 foundation — fonts, colours and theme are ready</span>
      </div>
    </main>
  );
}
