# Savings Circle

A group savings tracker for a friend group saving $100/week each.
React Router v7 + Tailwind + shadcn-style components + Postgres (Drizzle) + free Web Push reminders, deployed on Vercel.

## Stack

- **React Router v7** (framework mode, SSR) — routing + data loading
- **Tailwind CSS** — styling
- **shadcn-style components** — Button, Card, Progress (hand-added under `app/components/ui`, no CLI lock-in)
- **Postgres** via **Drizzle ORM** — use [Neon](https://neon.tech) or [Supabase](https://supabase.com) free tier, or Vercel's built-in Postgres storage tab
- **Web Push API** — free, native browser push notifications (no Twilio/OneSignal needed)
- **Vercel** — hosting + free Cron Jobs for the weekly reminder

## 1. Install

```bash
npm install
```

## 2. Set up Postgres

1. Create a free database at [neon.tech](https://neon.tech) or [supabase.com](https://supabase.com).
2. Copy `.env.example` to `.env` and paste your connection string into `DATABASE_URL`.
3. Push the schema:

```bash
npm run db:generate
npm run db:migrate
```

4. Seed a group and members (quickest via `npm run db:studio`, a GUI for your DB):

```sql
insert into groups (name, weekly_amount, goal_amount) values ('Christmas Party Fund', 100, 5200);
insert into users (name, email) values ('Alex', 'alex@example.com'), ('Sam', 'sam@example.com');
insert into group_members (group_id, user_id) select g.id, u.id from groups g, users u;
```

All amounts are stored as plain integers in the database and displayed with a ₱ (Philippine peso) prefix in the UI — see the `peso()` helper in `app/routes/dashboard.tsx`. Weekly push reminders fire every **Sunday at 9am** (see `vercel.json`'s cron schedule).

## 3. Set up push notifications (free)

```bash
npx web-push generate-vapid-keys
```

Paste the output into `.env` as `VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY`. Also set `CRON_SECRET` to any random string.

The public key needs to reach the browser — either inline it via an env-injected `<script>` in `root.tsx`, or simplest: hardcode it as `window.ENV_VAPID_PUBLIC_KEY` in `app/root.tsx` for now.

## 4. Run locally

```bash
npm run dev
```

Visit `http://localhost:5173`, click "Enable reminders" to test push (works on `localhost`, and on real deployments since Vercel serves HTTPS by default).

## 5. Deploy

```bash
npx vercel
```

Add the same `.env` variables in the Vercel project settings (Environment Variables tab). The `vercel.json` cron job hits `/api/push/notify` every Monday at 9am and pushes "your $100 is due" to everyone who enabled reminders — completely free on Vercel's Hobby plan (cron jobs included).

## What's stubbed vs done

- ✅ Schema, DB client, dashboard UI, mark-as-paid flow, goal progress bar
- ✅ Web Push subscribe + send flow, weekly cron wiring
- 🔲 Auth (no login yet — add [Clerk](https://clerk.com) or [Supabase Auth](https://supabase.com/auth), both free tier, then swap the hardcoded `x-user-id` header in `api.push-subscribe.ts` for the real session user)
- 🔲 Icons for the PWA manifest (add real ones under `/public`)

## Project structure

```
app/
  routes/
    dashboard.tsx        # main screen: members, weekly status, goal bar
    api.contribute.ts     # POST — mark a member as paid this week
    api.push-subscribe.ts # POST — save a browser's push subscription
    api.push-notify.ts    # POST — cron-triggered, sends reminders to everyone
  components/ui/          # shadcn-style Button, Card, Progress
db/
  schema.ts               # users, groups, group_members, contributions, push_subscriptions
  client.ts                # Drizzle + postgres-js client
public/
  sw.js                    # service worker, receives push events
  manifest.json             # PWA manifest
```
