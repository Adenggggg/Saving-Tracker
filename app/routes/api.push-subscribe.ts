import type { ActionFunctionArgs } from "react-router";
import { db } from "../../db/client";
import { pushSubscriptions } from "../../db/schema";

// NOTE: wire this to the logged-in user's id once you add auth.
// For now it demonstrates storing the browser's Web Push subscription (free, no third party).
export async function action({ request }: ActionFunctionArgs) {
  const sub = (await request.json()) as {
    endpoint: string;
    keys: { p256dh: string; auth: string };
  };

  const userId = request.headers.get("x-user-id");
  if (!userId) return new Response("Missing user", { status: 400 });

  await db
    .insert(pushSubscriptions)
    .values({
      userId,
      endpoint: sub.endpoint,
      p256dh: sub.keys.p256dh,
      auth: sub.keys.auth,
    })
    .onConflictDoNothing();

  return { ok: true };
}
