import type { ActionFunctionArgs } from "react-router";
import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { groups, contributions } from "../../db/schema";
import { getCurrentUser } from "~/lib/auth.server";
import { logAudit } from "~/lib/audit.server";

export async function action({ request }: ActionFunctionArgs) {
  const actor = await getCurrentUser(request);
  if (!actor) {
    return { ok: false, reason: "Please log in with your registered email to do this." };
  }

  const form = await request.formData();
  const groupId = String(form.get("groupId"));

  const group = (await db.select().from(groups).where(eq(groups.id, groupId)))[0];
  if (!group) {
    return { ok: false, reason: "Fund not found." };
  }

  const existing = await db.select().from(contributions).where(eq(contributions.groupId, groupId));

  await db.delete(contributions).where(eq(contributions.groupId, groupId));

  await logAudit({
    groupId,
    actorUserId: actor.id,
    actorName: actor.name,
    action: "reset_fund",
    detail: `${actor.name} reset all fund data, permanently deleting ${existing.length} contribution record(s).`,
  });

  return { ok: true };
}