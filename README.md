# KindCircle — Community Service Events

**Live site:** https://kindcircle-client.vercel.app

KindCircle is a community-driven platform where neighbours create, join and track
social service events in their local area — from winter clothes distributions in
Mirpur to tree plantations by Dhanmondi Lake.

## Features

- **Create community events** — organise a cleanup, plantation, donation drive,
  education session, health camp or food drive with a title, description, type,
  thumbnail, location and a future date (past dates are blocked on both client and server).

- **Upcoming events only** — the events page automatically hides events whose date
  has passed, with instant **search by title/location** and **filter by event type**.

- **One-click joining** — anyone can view event details, and logged-in users can join;
  duplicate joins are prevented and the volunteer count updates live.

- **Personal dashboards** — "Joined Events" lists everything you signed up for sorted
  by date, and "Manage Events" lets you update or delete only the events you created.

- **Secure authentication** — email/password and GitHub login with BetterAuth,
  password rules (uppercase, lowercase, 6+ characters) and JWT-protected APIs.

- **Light & dark mode** — a theme toggle that switches the entire site.

- **Responsive design with loading skeletons** — works smoothly on mobile, tablet and desktop.

## Tech Stack

- **Frontend:** Next.js (App Router), JavaScript, Tailwind CSS, shadcn/ui

- **Auth:** BetterAuth with MongoDB adapter, GitHub OAuth, JWT plugin

- **Forms & validation:** react-hook-form + zod

- **Backend:** Express.js + MongoDB (separate repository)

## Related Repository

- Server: https://github.com/ArifBillah792/kindcircle-server