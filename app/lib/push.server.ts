import webpush from "web-push";
import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { pushSubscriptions } from "../../db/schema";

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

type PushPayload = {
  title: string;
  body: string;
  url?: string;
};

export async function sendPushToUser(userId: string, payload: PushPayload): Promise<number> {
  const subs = await db.select().from(pushSubscriptions).where(eq(pushSubscriptions.userId, userId));

  if (subs.length === 0) return 0;

  const results = await Promise.allSettled(
    subs.map((sub) =>
      webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        },
        JSON.stringify(payload)
      )
    )
  );

  let sent = 0;
  await Promise.all(
    results.map(async (r, i) => {
      if (r.status === "fulfilled") {
        sent++;
      } else {
        const statusCode = (r.reason as { statusCode?: number })?.statusCode;
        if (statusCode === 404 || statusCode === 410) {
          // Subscription is no longer valid (user revoked permission, uninstalled, etc.)
          await db.delete(pushSubscriptions).where(eq(pushSubscriptions.id, subs[i].id));
        } else {
          console.error("Push send failed:", r.reason);
        }
      }
    })
  );

  return sent;
}