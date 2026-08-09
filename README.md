# Savings Circle

A simple group savings tracker for friends saving **₱100/week each**.

Track contributions, monitor your shared savings goal, and receive weekly browser push reminders.

## Tech Stack

* **React Router v7** — framework mode + SSR
* **TypeScript**
* **Tailwind CSS**
* **shadcn-style UI components**
* **PostgreSQL + Drizzle ORM**
* **Web Push API** — browser notifications
* **Vercel** — hosting + cron jobs

## Features

* Group and member tracking
* Weekly contribution tracking
* Savings goal progress
* Browser push reminders
* Automated weekly reminders via Vercel Cron
* PWA-ready

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy the example environment file:

```bash
cp .env.example .env
```

Set the following variables:

```env
DATABASE_URL=
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
```

### 3. Set up the database

```bash
npm run db:generate
npm run db:migrate
```

Optionally open Drizzle Studio:

```bash
npm run db:studio
```

### 4. Generate VAPID keys

```bash
npx web-push generate-vapid-keys
```

Add the generated keys to `.env`.

### 5. Run locally

```bash
npm run dev
```
## Roadmap

* [ ] Authentication
* [ ] Group creation UI
* [ ] Member invitations
* [ ] Contribution history
* [ ] Payment verification
* [ ] Proper PWA icons

## Status

**In development**

Core savings tracking, goal progress, Web Push notifications, and scheduled reminders are implemented.
