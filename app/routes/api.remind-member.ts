import type { ActionFunctionArgs } from "react-router";
import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { users, groups } from "../../db/schema";
import { sendReminderEmail } from "~/lib/email.server";

// Sends a one-off "your contribution is pending" email to a single member.
// Used by the "Remind" button on the Members page.
export async function action({ request }: ActionFunctionArgs) {
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