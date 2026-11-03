# KindCircle – Client (project instructions for AI coding agents)

KindCircle is a community-service event platform. Users create, join and track social
service events in their local area (e.g. "Winter Clothes Distribution – Mirpur 10, Dhaka").
This repo is the **Next.js client**. The Express + MongoDB API is a separate repo and is
already built and deployed.

Work **one phase at a time** when asked. Do not build features that were not requested in
the current prompt. Keep code simple and readable — the student must be able to explain it.

---

## Tech stack (do not change)

- Next.js (App Router), **JavaScript** (no TypeScript), `src/` directory, alias `@/*`
- Tailwind CSS + **shadcn/ui** components (install with `npx shadcn@latest add <name>`)
- `next-themes` for light/dark mode (class strategy, toggle in navbar)
- `sonner` (shadcn `sonner` component) for ALL success/error messages
- `react-hook-form` + `zod` for form validation
- `lucide-react` icons; for X (Twitter) use the **new X logo**, never the bird
- **BetterAuth** with the **MongoDB adapter**, email/password + **GitHub** login, and the
  **JWT plugin** so the Express API can verify users

## Hard rules from the assignment

- NEVER use `alert()`, `confirm()` or `prompt()`. Use sonner toasts and shadcn `AlertDialog`.
- NEVER use Lorem ipsum. Write real, community-service-themed text.
- Reloading any route must not error. A logged-in user reloading a private route must NOT
  be sent to /login → protect private pages with a **server-side session check** in a
  layout (see Auth), not only client-side.
- Fully responsive (mobile, tablet, desktop). Dark mode must cover the whole app.
- Consistent design: same heading style across sections, same button style everywhere,
  equal-height/equal-width cards, equal image sizes (`aspect-video object-cover`), grid layouts.
- No email verification, no forgot-password.

## Design direction

Warm, hopeful, human — not a generic SaaS template. Suggested palette: deep green primary
(growth, community) with a warm amber/terracotta accent. A friendly serif or rounded display
font for headings (via `next/font/google`), clean sans for body. Logo: a simple circle mark +
"KindCircle" wordmark, identical in navbar and footer.

---

## Environment variables (`.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:8000      # Express API (prod: https://kindcircle-server-roan.vercel.app)
BETTER_AUTH_SECRET=<random 32+ chars>
BETTER_AUTH_URL=http://localhost:3000          # prod: the deployed client URL
MONGODB_URI=<same Atlas connection string as server>
DB_NAME=kindcircleDB
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

## Auth (BetterAuth)

- `src/lib/auth.js` (server only): `betterAuth({ database: mongodbAdapter(db, { client }),
  emailAndPassword: { enabled: true }, socialProviders: { github: {...} },
  plugins: [jwt(), nextCookies()] })`. Check the installed `better-auth` package for the exact
  import paths of `mongodbAdapter`, `jwt` and `nextCookies`.
- **DNS fix (required on this machine):** before creating the MongoClient in `auth.js`, add
  `import dns from "node:dns"; dns.setServers(["8.8.8.8", "1.1.1.1"]);` — otherwise
  `querySrv ECONNREFUSED` happens.
- Route handler: `src/app/api/auth/[...all]/route.js` using `toNextJsHandler(auth)`.
- `src/lib/auth-client.js`: `createAuthClient({ plugins: [jwtClient()] })`. Export
  `signIn`, `signUp`, `signOut`, `useSession`, and the client itself.
- Register fields: name, email, photoURL (saved as `image`), password.
  Password rules: at least one uppercase, one lowercase, min length 6 → show the error.
- Login: email + password, plus "Continue with GitHub" (`signIn.social({ provider: "github" })`).
- Toast on successful login/register. Redirect back to `?redirect=` target or `/`.
- Private pages live in a route group `src/app/(private)/` whose `layout.js` calls
  `auth.api.getSession({ headers: await headers() })` and `redirect("/login?redirect=...")`
  when there is no session.

## Calling the API

Create `src/lib/api.js` with one helper, e.g. `apiFetch(path, { method, body, auth })`:
- base URL = `process.env.NEXT_PUBLIC_API_URL`
- when `auth: true`, get a JWT with `authClient.token()` and send
  `Authorization: Bearer <token>`
- JSON in/out; if `!res.ok`, throw `new Error(data.message)` so pages can toast it.

## API contract (Express server)

All errors look like `{ "message": "..." }`. Dates are sent as `"YYYY-MM-DD"` strings and
returned as ISO strings (`"2026-12-20T00:00:00.000Z"`). Display dates with
`toLocaleDateString("en-GB", { timeZone: "UTC", day: "numeric", month: "long", year: "numeric" })`
so they never shift by a day.

Event types (dropdown, exact strings):
`Cleanup, Plantation, Donation, Education, Health Camp, Food Drive`

Event object:
```json
{
  "_id": "...", "title": "...", "description": "...", "eventType": "Donation",
  "thumbnail": "https://...", "location": "Mirpur 10, Dhaka",
  "eventDate": "2026-12-20T00:00:00.000Z",
  "creatorEmail": "...", "creatorName": "...", "creatorPhoto": "...",
  "participantCount": 0, "createdAt": "..."
}
```

| Method | Path | Auth | Body / result |
|---|---|---|---|
| GET | `/events` | public | all upcoming events (today or later), soonest first |
| GET | `/events/recent` | public | 6 nearest upcoming events (home page) |
| GET | `/events/:id` | public | one event |
| POST | `/events` | JWT | `{ title, description, eventType, thumbnail, location, eventDate }` → 201 |
| GET | `/my-events` | JWT | events created by the logged-in user |
| PATCH | `/events/:id` | JWT | same body as POST; only the creator (403 otherwise) |
| DELETE | `/events/:id` | JWT | only the creator |
| POST | `/events/:id/join` | JWT | no body → 201; 409 if already joined; 400 if event ended |
| GET | `/joined-events` | JWT | join records sorted by event date |
| GET | `/events/:id/join-status` | JWT | `{ "joined": true/false }` |

Join record (from `/joined-events`):
```json
{ "_id": "...", "eventId": "...", "eventTitle": "...", "eventType": "...",
  "eventLocation": "...", "eventThumbnail": "...", "eventDate": "...",
  "userEmail": "...", "userName": "...", "userPhoto": "...", "joinedAt": "..." }
```

The creator/user identity comes from the JWT on the server — the client never sends
emails for these routes.

## Images

Event thumbnails and profile photos are arbitrary https URLs. Configure
`images.remotePatterns` in `next.config.mjs` with `{ protocol: "https", hostname: "**" }`
if using `next/image`.

## Pages

Public: `/` (home), `/events` (upcoming), `/events/[id]` (details), `/login`, `/register`
Private (inside `(private)` group): `/create-event`, `/manage-events`,
`/manage-events/[id]/edit` (update), `/joined-events`, `/profile`
Also: a friendly `not-found.js` page and loading skeletons for data lists.
