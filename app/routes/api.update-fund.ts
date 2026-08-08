import type { ActionFunctionArgs } from "react-router";
import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { groups } from "../../db/schema";
import { getUserId } from "~/lib/session.server";

export async function action({ request }: ActionFunctionArgs) {
  const requesterId = await getUserId(request);
  if (!requesterId) {
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

  await db
    .update(groups)
    .set({ name: name.trim(), weeklyAmount, goalAmount })
    .where(eq(groups.id, groupId));

  return { ok: true };
}