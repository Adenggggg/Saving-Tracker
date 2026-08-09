import type { ActionFunctionArgs } from "react-router";
import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { users, groups } from "../../db/schema";
import { sendReminderEmail } from "~/lib/email.server";
import { getCurrentUser } from "~/lib/auth.server";
import { logAudit } from "~/lib/audit.server";

export async function action({ request }: ActionFunctionArgs) {
  const actor = await getCurrentUser(request);
  if (!actor) {
    return { ok: false, reason: "Please log in with your registered email to do this." };
  }

  const form = await request.formData();
  const userId = String(form.get("userId"));

  const user = (await db.select().from(users).where(eq(users.id, userId)))[0];
  const group = (await db.select().from(groups).limit(1))[0];

  if (!user) {
    return { ok: false, reason: "Member not found." };
  }

  try {
    await sendReminderEmail(user.email, user.name, group?.name ?? "Savings Group");

    if (group) {
      await logAudit({
        groupId: group.id,
        actorUserId: actor.id,
        actorName: actor.name,
        action: "remind_member",
        detail: `${actor.name} sent a reminder email to ${user.name}.`,
      });
    }

    return { ok: true };
  } catch (err) {
    console.error("Failed to send reminder email:", err);
    return { ok: false, reason: "Couldn't send the email. Check GMAIL_USER / GMAIL_APP_PASSWORD in .env." };
  }
}