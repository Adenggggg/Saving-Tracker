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
  const contributionId = String(form.get("contributionId"));

  const row = (await db.select().from(contributions).where(eq(contributions.id, contributionId)))[0];
  if (!row) {
    return { ok: false, reason: "That payment no longer exists." };
  }

  const target = (await db.select().from(users).where(eq(users.id, row.userId)))[0];

  await db.delete(contributions).where(eq(contributions.id, contributionId));

  await logAudit({
    groupId: row.groupId,
    actorUserId: actor.id,
    actorName: actor.name,
    action: "undo_payment",
    detail: `${actor.name} undid a ${peso(row.amount)} payment for ${target?.name ?? "a member"} (week of ${row.weekStart}).`,
  });

  return { ok: true };
}