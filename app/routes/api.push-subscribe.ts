import type { ActionFunctionArgs } from "react-router";
import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { pushSubscriptions } from "../../db/schema";
import { getCurrentUser } from "~/lib/auth.server";

export async function action({ request }: ActionFunctionArgs) {
  const user = await getCurrentUser(request);
  if (!user) {
    return { ok: false, reason: "Please log in first." };
  }

  const body = await request.json();

  if (body.intent === "unsubscribe") {
    await db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, body.endpoint));
    return { ok: true };
  }

  const { endpoint, keys } = body.subscription;

  await db
    .insert(pushSubscriptions)
    .values({
      userId: user.id,
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
    })
    .onConflictDoUpdate({
      target: pushSubscriptions.endpoint,
      set: { userId: user.id, p256dh: keys.p256dh, auth: keys.auth },
    });

  return { ok: true };
}