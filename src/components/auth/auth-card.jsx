import { Logo } from "@/components/logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AuthCard({ title, description, footer, children }) {
  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-10 sm:px-6 sm:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--secondary),transparent_55%),radial-gradient(ellipse_at_bottom_right,var(--accent),transparent_55%)]"
      />

      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>

        <Card className="shadow-lg shadow-primary/5">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>

          <CardContent>{children}</CardContent>

          {footer ? (
            <CardFooter className="justify-center text-sm text-muted-foreground">
              {footer}
            </CardFooter>
          ) : null}
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Together, small acts of service add up.
        </p>
      </div>
    </main>
  );
}
