import type { ActionFunctionArgs } from "react-router";
import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { groups } from "../../db/schema";
import { getCurrentUser } from "~/lib/auth.server";
import { logAudit } from "~/lib/audit.server";
import { peso } from "~/lib/dashboard-format";

export async function action({ request }: ActionFunctionArgs) {
  const actor = await getCurrentUser(request);
  if (!actor) {
    return { ok: false, reason: "Please log in with your registered email to do this." };
  }

  const form = await request.formData();
  const groupId = String(form.get("groupId"));
  const name = String(form.get("name"));
  const weeklyAmount = Number(form.get("weeklyAmount"));
  const goalAmount = Number(form.get("goalAmount"));

  if (!name.trim() || weeklyAmount <= 0 || goalAmount <= 0) {
    return { ok: false, reason: "Please fill in valid values for all fields." };
  }

  const before = (await db.select().from(groups).where(eq(groups.id, groupId)))[0];

  await db
    .update(groups)
    .set({ name: name.trim(), weeklyAmount, goalAmount })
    .where(eq(groups.id, groupId));

  const changes: string[] = [];
  if (before) {
    if (before.name !== name.trim()) changes.push(`name to "${name.trim()}"`);
    if (before.weeklyAmount !== weeklyAmount) changes.push(`weekly amount to ${peso(weeklyAmount)}`);
    if (before.goalAmount !== goalAmount) changes.push(`goal to ${peso(goalAmount)}`);
  }

  await logAudit({
    groupId,
    actorUserId: actor.id,
    actorName: actor.name,
    action: "update_fund",
    detail: changes.length
      ? `${actor.name} updated the ${changes.join(", ")}.`
      : `${actor.name} saved fund settings.`,
  });

  return { ok: true };
}