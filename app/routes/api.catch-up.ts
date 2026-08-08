import type { ActionFunctionArgs } from "react-router";
import { db } from "../../db/client";
import { contributions } from "../../db/schema";
import { getUserId } from "~/lib/session.server";

export async function action({ request }: ActionFunctionArgs) {
  const requesterId = await getUserId(request);
  if (!requesterId) {
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

  return { ok: true, count: body.entries.length };
}