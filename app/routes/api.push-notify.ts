import type { ActionFunctionArgs } from "react-router";
import webpush from "web-push";
import { db } from "../../db/client";
import { pushSubscriptions } from "../../db/schema";

webpush.setVapidDetails(
  "mailto:you@example.com",
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

// Trigger this weekly with a free Vercel Cron job (see vercel.json).
// Sends "your $100 is due" to everyone with a saved push subscription.
export async function action({ request }: ActionFunctionArgs) {
  const secret = request.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  const subs = await db.select().from(pushSubscriptions);

  const payload = JSON.stringify({
    title: "Christmas Party Fund",
    body: "Your ₱100 is due this week",
  });

  await Promise.allSettled(
    subs.map((s) =>
      webpush.sendNotification(
        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
        payload
      )
    )
  );

  return { sent: subs.length };
}
