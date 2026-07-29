import type { ActionFunctionArgs } from "react-router";
import { eq } from "drizzle-orm";
import webpush from "web-push";
import { db } from "../../db/client";
import { pushSubscriptions } from "../../db/schema";

webpush.setVapidDetails(
  "mailto:you@example.com",
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const userId = String(form.get("userId"));

  const subs = await db
    .select()
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.userId, userId));

  if (subs.length === 0) {
    return { ok: false, reason: "This member hasn't enabled push reminders yet." };
  }

  const payload = JSON.stringify({
    title: "Christmas Party Fund",
    body: "Friendly reminder: your contribution is still pending this week.",
  });

  await Promise.allSettled(
    subs.map((s) =>
      webpush.sendNotification(
        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
        payload
      )
    )
  );

  return { ok: true };
}