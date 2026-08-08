import type { ActionFunctionArgs } from "react-router";
import { db } from "../../db/client";
import { contributions } from "../../db/schema";
import { getUserId } from "~/lib/session.server";

export async function action({ request }: ActionFunctionArgs) {
  const requesterId = await getUserId(request);
  if (!requesterId) {
    return { ok: false, reason: "Please log in with your registered email to do this." };
  }

  const form = await request.formData();
  const userId = String(form.get("userId"));
  const groupId = String(form.get("groupId"));
  const amount = Number(form.get("amount"));
  const weekStart = String(form.get("weekStart"));

  await db.insert(contributions).values({ userId, groupId, amount, weekStart });

  return { ok: true };
}