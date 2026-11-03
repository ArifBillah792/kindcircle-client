export function PageHeading({ eyebrow, title, description }) {
  return (
    <div className="mb-10 text-center">
      {eyebrow && (
        <span className="inline-block rounded-full bg-accent px-4 py-1 text-sm font-medium text-accent-foreground">
          {eyebrow}
        </span>
      )}
      <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
