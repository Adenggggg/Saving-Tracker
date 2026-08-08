import type { ActionFunctionArgs } from "react-router";
import { eq, and } from "drizzle-orm";
import { db } from "../../db/client";
import { groups, groupMembers, users, contributions } from "../../db/schema";
import { currentWeekStart } from "~/lib/dashboard-format";
import { sendReminderEmail } from "~/lib/email.server";
import { getUserId } from "~/lib/session.server";

export async function action({ request }: ActionFunctionArgs) {
  const requesterId = await getUserId(request);
  if (!requesterId) {
    return { ok: false, reason: "Please log in with your registered email to do this." };
  }

  const form = await request.formData();
  const groupId = String(form.get("groupId"));

  const group = (await db.select().from(groups).where(eq(groups.id, groupId)))[0];
  if (!group) {
    return { ok: false, reason: "Fund not found." };
  }

  const members = await db
    .select({ id: users.id, name: users.name, email: users.email })
    .from(groupMembers)
    .innerJoin(users, eq(users.id, groupMembers.userId))
    .where(eq(groupMembers.groupId, groupId));

  const weekStart = currentWeekStart();
  const paidRows = await db
    .select()
    .from(contributions)
    .where(and(eq(contributions.groupId, groupId), eq(contributions.weekStart, weekStart)));

  const paidIds = new Set(paidRows.map((r) => r.userId));
  const pending = members.filter((m) => !paidIds.has(m.id));

  if (pending.length === 0) {
    return { ok: true, sentCount: 0, reason: "Everyone has already paid this week." };
  }

  const results = await Promise.allSettled(
    pending.map((m) => sendReminderEmail(m.email, m.name, group.name))
  );

  const sentCount = results.filter((r) => r.status === "fulfilled").length;
  const failedCount = results.length - sentCount;

  if (sentCount === 0) {
    return { ok: false, reason: "Couldn't send any reminders. Check GMAIL_USER / GMAIL_APP_PASSWORD." };
  }

  return {
    ok: true,
    sentCount,
    reason: failedCount > 0 ? `${failedCount} reminder(s) failed to send.` : undefined,
  };
}