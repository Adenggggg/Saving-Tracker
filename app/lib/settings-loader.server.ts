import { db } from "../../db/client";
import { groups } from "../../db/schema";
import { getBudgetCategories } from "~/lib/budget-categories.server";

export async function loadSettingsData() {
  const group = (await db.select().from(groups).limit(1))[0];

  if (!group) {
    return { group: null, categories: [] };
  }

  const categories = await getBudgetCategories(group.id);

  return { group, categories };
}