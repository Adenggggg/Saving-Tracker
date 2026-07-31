import type { ActionFunctionArgs } from "react-router";
import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { groups } from "../../db/schema";

export async function action({ request }: ActionFunctionArgs) {
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