import type { ActionFunctionArgs } from "react-router";
import { and, eq } from "drizzle-orm";
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

  const body = (await request.json()) as {
    userId: string;
    groupId: string;
    entries: { weekStart: string; amount: number }[];
    full?: boolean;
  };

  if (!body.entries || body.entries.length === 0) {
    return { ok: false, reason: "Select at least one week to catch up on." };
  }

  for (const entry of body.entries) {
    if (!(entry.amount > 0)) {
      return { ok: false, reason: "Each week's amount must be greater than zero." };
    }
  }

  // Duplicate guard: never insert a week this member already paid (or repeat a week in the payload).
  const existing = await db
    .select({ weekStart: contributions.weekStart })
    .from(contributions)
    .where(and(eq(contributions.userId, body.userId), eq(contributions.groupId, body.groupId)));
  const alreadyPaid = new Set(existing.map((r) => r.weekStart));

  const seen = new Set<string>();
  const entries = body.entries.filter((e) => {
    if (alreadyPaid.has(e.weekStart) || seen.has(e.weekStart)) return false;
    seen.add(e.weekStart);
    return true;
  });

  if (entries.length === 0) {
    return { ok: false, reason: "Those weeks are already paid." };
  }

  // No advance-week cap here: the dialog/loader decide which weeks are offered,
  // so "Pay in Full" can cover every remaining week.
  await db.insert(contributions).values(
    entries.map((e) => ({
      userId: body.userId,
      groupId: body.groupId,
      amount: e.amount,
      weekStart: e.weekStart,
    }))
  );

  const total = entries.reduce((sum, e) => sum + e.amount, 0);
  const target = (await db.select().from(users).where(eq(users.id, body.userId)))[0];
  const targetName = target?.name ?? "a member";

  await logAudit({
    groupId: body.groupId,
    actorUserId: actor.id,
    actorName: actor.name,
    action: "catch_up",
    detail: body.full
      ? `${actor.name} paid the full remaining balance of ${peso(total)} (${entries.length} week${entries.length === 1 ? "" : "s"}) for ${targetName}.`
      : `${actor.name} recorded ${entries.length} catch-up payment(s) totaling ${peso(total)} for ${targetName}.`,
  });

  return { ok: true, count: entries.length };
}