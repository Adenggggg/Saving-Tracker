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

  const body = (await request.json()) as {
    userId: string;
    groupId: string;
    entries: { weekStart: string; amount: number }[];
  };

  if (!body.entries || body.entries.length === 0) {
    return { ok: false, reason: "Select at least one week to catch up on." };
  }

  for (const entry of body.entries) {
    if (entry.amount <= 0) {
      return { ok: false, reason: "Each week's amount must be greater than zero." };
    }
  }

  for (const entry of body.entries) {
    await db.insert(contributions).values({
      userId: body.userId,
      groupId: body.groupId,
      amount: entry.amount,
      weekStart: entry.weekStart,
    });
  }

  const total = body.entries.reduce((sum, e) => sum + e.amount, 0);
  const target = (await db.select().from(users).where(eq(users.id, body.userId)))[0];

  await logAudit({
    groupId: body.groupId,
    actorUserId: actor.id,
    actorName: actor.name,
    action: "catch_up",
    detail: `${actor.name} recorded ${body.entries.length} catch-up payment(s) totaling ${peso(total)} for ${target?.name ?? "a member"}.`,
  });

  return { ok: true, count: body.entries.length };
}