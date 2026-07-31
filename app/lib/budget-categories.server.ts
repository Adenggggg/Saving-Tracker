import { eq, asc } from "drizzle-orm";
import { db } from "../../db/client";
import { budgetCategories } from "../../db/schema";

const DEFAULTS = [
  { label: "Food & Catering", percent: 48, description: "Includes main courses, beverages, and service staff." },
  { label: "Venue & Decor", percent: 30, description: "Location rental, floral arrangements, and lighting." },
  { label: "Gifts & Prizes", percent: 22, description: "Trophies, individual gift bags, and raffle items." },
];

export async function getBudgetCategories(groupId: string) {
  const existing = await db
    .select()
    .from(budgetCategories)
    .where(eq(budgetCategories.groupId, groupId))
    .orderBy(asc(budgetCategories.sortOrder));

  if (existing.length > 0) return existing;

  const seeded = await db
    .insert(budgetCategories)
    .values(
      DEFAULTS.map((d, i) => ({
        groupId,
        label: d.label,
        description: d.description,
        percent: d.percent,
        sortOrder: i,
      }))
    )
    .returning();

  return seeded.sort((a, b) => a.sortOrder - b.sortOrder);
}