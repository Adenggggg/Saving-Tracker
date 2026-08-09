import type { ActionFunctionArgs } from "react-router";
import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { contributions, users } from "../../db/schema";
import { getCurrentUser } from "~/lib/auth.server";
import { logAudit } from "~/lib/audit.server";
import { peso } from "~/lib/dashboard-format";

export async function action({ request }: ActionFunctionArgs) {
  const actor = await getCurrentUser(request);
  if (!actor) {
    return { ok: false, reason: "Please log in with your registered email to do this." };
  }

  const form = await request.formData();
  const userId = String(form.get("userId"));
  const groupId = String(form.get("groupId"));
  const amount = Number(form.get("amount"));
  const weekStart = String(form.get("weekStart"));

  await db.insert(contributions).values({ userId, groupId, amount, weekStart });

  const target = (await db.select().from(users).where(eq(users.id, userId)))[0];
  await logAudit({
    groupId,
    actorUserId: actor.id,
    actorName: actor.name,
    action: "mark_paid",
    detail: `${actor.name} marked ${target?.name ?? "a member"} as paid ${peso(amount)} for the week of ${weekStart}.`,
  });

  return { ok: true };
}