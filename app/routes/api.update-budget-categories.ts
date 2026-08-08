import type { ActionFunctionArgs } from "react-router";
import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { budgetCategories } from "../../db/schema";
import { getUserId } from "~/lib/session.server";

export async function action({ request }: ActionFunctionArgs) {
  const requesterId = await getUserId(request);
  if (!requesterId) {
    return { ok: false, reason: "Please log in with your registered email to do this." };
  }

  const body = (await request.json()) as {
    categories: { id: string; label: string; description: string; percent: number }[];
  };

  if (!body.categories || body.categories.length === 0) {
    return { ok: false, reason: "No categories provided." };
  }

  const total = body.categories.reduce((sum, c) => sum + c.percent, 0);
  if (total !== 100) {
    return { ok: false, reason: `Percentages must add up to 100% (currently ${total}%).` };
  }

  for (const cat of body.categories) {
    if (!cat.label.trim() || cat.percent < 0) {
      return { ok: false, reason: "Each category needs a name and a non-negative percentage." };
    }
    await db
      .update(budgetCategories)
      .set({ label: cat.label.trim(), description: cat.description.trim() || null, percent: cat.percent })
      .where(eq(budgetCategories.id, cat.id));
  }

  return { ok: true };
}