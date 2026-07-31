import type { ActionFunctionArgs } from "react-router";
import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { groups, contributions } from "../../db/schema";

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const groupId = String(form.get("groupId"));

  const group = (await db.select().from(groups).where(eq(groups.id, groupId)))[0];
  if (!group) {
    return { ok: false, reason: "Fund not found." };
  }

  await db.delete(contributions).where(eq(contributions.groupId, groupId));

  return { ok: true };
}