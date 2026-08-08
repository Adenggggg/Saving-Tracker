import type { ActionFunctionArgs } from "react-router";
import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { groups, contributions } from "../../db/schema";
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

  await db.delete(contributions).where(eq(contributions.groupId, groupId));

  return { ok: true };
}