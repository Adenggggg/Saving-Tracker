import type { ActionFunctionArgs } from "react-router";
import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { users, groups } from "../../db/schema";
import { sendReminderEmail } from "~/lib/email.server";
import { getUserId } from "~/lib/session.server";

export async function action({ request }: ActionFunctionArgs) {
  const requesterId = await getUserId(request);
  if (!requesterId) {
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
    return { ok: true };
  } catch (err) {
    console.error("Failed to send reminder email:", err);
    return { ok: false, reason: "Couldn't send the email. Check GMAIL_USER / GMAIL_APP_PASSWORD in .env." };
  }
}