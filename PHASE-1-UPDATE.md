# Phase 1 Update — Project Foundation

**Project:** KindCircle Client (Next.js App Router, JavaScript)
**Scope:** Tooling, theming, fonts, design tokens and a placeholder home page only.
No navbar, auth, API helper or feature pages were built in this phase.

---

## 1. shadcn/ui initialized

- Ran `npx shadcn@latest init` with the latest shadcn CLI, JavaScript and the `@/*` alias.
- Added a `components.json` using the `radix-nova` style, `neutral` base colour, CSS variables, RSC enabled and Lucide icons.
- Added `src/lib/utils.js` exposing the `cn()` helper.
- Installed the requested components into `src/components/ui/`:

`button`, `input`, `label`, `textarea`, `card`, `select`, `dropdown-menu`, `avatar`,
`tooltip`, `skeleton`, `sonner`, `alert-dialog`, `badge`, `separator`.

> The latest shadcn release generates slightly different component internals than older
> tutorials (for example it uses the unified `radix-ui` package and a `cn` package), but
> the public APIs (`Button`, `Card`, `Input`, etc.) are the usual shadcn ones.

---

## 2. Dependencies installed

Runtime dependencies added:

| Package | Purpose |
|---|---|
| `next-themes` | Light / dark / system theme switching |
| `react-hook-form` | Form state (used in later phases) |
| `zod` | Schema validation (used in later phases) |
| `@hookform/resolvers` | Connects zod to react-hook-form |
| `lucide-react` | Icons (Sun/Moon already used by the toggle) |
| `sonner` | Toast notifications, via the shadcn Sonner component |
| `class-variance-authority`, `radix-ui`, `tw-animate-css`, `cn`, `shadcn` | Installed automatically by shadcn |

---

## 3. Theme support

### `src/components/theme-provider.jsx`

- Client component wrapping `next-themes`.
- Configured with `attribute="class"`, `defaultTheme="system"` and `enableSystem` inherited from next-themes defaults.

### `src/components/theme-toggle.jsx`

- Client component using a shadcn `Button` (`variant="outline"`, `size="icon"`).
- Shows a Sun icon in dark mode and a Moon icon in light mode.
- The visible icon is decided with CSS (`hidden dark:block` / `dark:hidden`) instead of
  a `mounted` state, so server and client markup always match and hydration never warns.
- Fully keyboard accessible (real `<button>`, `aria-label`, `title`).
- **Currently rendered temporarily on the home page** so the theme can be tested before
  the navbar exists. It is ready to be moved into the navbar in a later phase.

### `src/app/layout.js`

- `suppressHydrationWarning` added to `<html>` (required by next-themes).
- `ThemeProvider` wraps the app.
- shadcn `Toaster` (`<Toaster richColors closeButton />`) is mounted once for the whole app.

---

## 4. KindCircle design tokens (`src/app/globals.css`)

Both light and dark palettes are defined with `oklch` colour values, so the theme covers
the whole app and every shadcn component inherits it.

| Token | Light | Dark |
|---|---|---|
| `--primary` (deep green) | `oklch(0.4 0.095 155)` | `oklch(0.74 0.1 150)` |
| `--primary-foreground` | warm off-white | deepest green |
| `--accent` (warm amber surface) | `oklch(0.94 0.035 72)` | `oklch(0.31 0.04 60)` |
| `--accent-foreground` (terracotta ink) | `oklch(0.4 0.1 48)` | `oklch(0.9 0.06 75)` |
| `--terracotta` (new token) | `oklch(0.57 0.14 45)` | `oklch(0.7 0.13 50)` |
| `--background` | warm ivory | deep forest green |
| `--card` / `--popover` | white | dark forest green |
| `--border` / `--input` | warm neutral | translucent white |

Additional tokens were aligned to the same palette: `--secondary`, `--muted`,
`--muted-foreground`, `--ring`, `--destructive`, `--sidebar-*` and `--chart-1..5`.

A custom `--color-terracotta` theme entry means Tailwind utilities such as
`bg-terracotta`, `text-terracotta` and `border-terracotta` are available everywhere.

The dark variant is class-based (`@custom-variant dark (&:is(.dark *))`), matching
next-themes' `attribute="class"` setting.

---

## 5. Fonts

Loaded with `next/font/google` in `src/app/layout.js` and exposed as CSS variables:

| Font | Variable | Usage |
|---|---|---|
| **Fraunces** (friendly serif) | `--font-display` → `--font-heading` | All `h1`–`h6` headings |
| **Plus Jakarta Sans** (clean sans) | `--font-body` → `--font-sans` | Body copy and UI |

Both are wired into Tailwind through `@theme inline`:

- `font-heading` utility → Fraunces
- `font-sans` utility (and default body font) → Plus Jakarta Sans
- `font-mono` falls back to the system monospace stack

---

## 6. Home page (`src/app/page.js`)

Replaced the default Next.js starter page with a warm, on-brand placeholder:

- Centered `KindCircle` heading in the display font and deep green primary colour.
- Short community-service tagline ("Bringing neighbours together to clean, plant, share and care...").
- Soft radial background washes built from the green and amber tokens.
- Terracotta capsule badge and three palette dots to show the colours clearly.
- Temporary `ThemeToggle` button in the top-right corner.
- Fully responsive with `px-6`, `text-5xl` → `sm:text-7xl`, and no fixed widths that
  would overflow on mobile.

---

## 7. Metadata and images (`src/app/layout.js`, `next.config.mjs`)

- Site title: `KindCircle — Community Service Events`.
- Description: community-service-focused text (no placeholder/Lorem ipsum).
- `next.config.mjs` now allows remote images from any HTTPS host:

```js
images: {
  remotePatterns: [{ protocol: "https", hostname: "**" }],
}
```

Existing `reactCompiler`, Turbopack and `experimental.agentFeedback` settings were kept.

---

## 8. Verification

- `npm run lint` → passes with no errors or warnings.
- `npm run build` → production build succeeds (static `/` route generated).
- Ran `npm run dev` and requested `/` → HTTP 200; confirmed:
  - both Google font variables are applied to `<html>`,
  - the next-themes inline script is present,
  - the Sonner `<Toaster />` region is mounted,
  - kindcircle colour tokens and terracotta utilities exist in the compiled CSS.
- Kill-check: the dev server was stopped after verification; no background process remains.

---

## 9. Files created / changed

### Created

- `components.json`
- `src/lib/utils.js`
- `src/components/theme-provider.jsx`
- `src/components/theme-toggle.jsx`
- `src/components/ui/button.jsx`
- `src/components/ui/input.jsx`
- `src/components/ui/label.jsx`
- `src/components/ui/textarea.jsx`
- `src/components/ui/card.jsx`
- `src/components/ui/select.jsx`
- `src/components/ui/dropdown-menu.jsx`
- `src/components/ui/avatar.jsx`
- `src/components/ui/tooltip.jsx`
- `src/components/ui/skeleton.jsx`
- `src/components/ui/sonner.jsx`
- `src/components/ui/alert-dialog.jsx`
- `src/components/ui/badge.jsx`
- `src/components/ui/separator.jsx`

### Changed

- `src/app/globals.css` — KindCircle light + dark tokens, font theme entries, terracotta token
- `src/app/layout.js` — fonts, theme provider, toaster, metadata, `suppressHydrationWarning`
- `src/app/page.js` — new placeholder home page
- `next.config.mjs` — `images.remotePatterns`
- `package.json` / `package-lock.json` — new dependencies
- `AGENTS.md` — auto-updated by `next dev` with its managed Next.js agent guidance blocks

---

## 10. Notes for the next phase

- Move `ThemeToggle` from the home page into the navbar once it exists.
- Wrap the app (or the relevant sections) in shadcn `TooltipProvider` before using
  `Tooltip` in pages/components.
- Keep using `font-heading` for section headings so the serif display font stays consistent.
- Reuse `bg-terracotta` / `text-terracotta` for warm accents and `text-primary` for the
  green brand colour instead of hard-coded hex values.
