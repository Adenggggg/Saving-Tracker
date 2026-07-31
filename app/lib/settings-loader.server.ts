import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { groups, groupMembers, users } from "../../db/schema";
import { getBudgetCategories } from "~/lib/budget-categories.server";

export async function loadSettingsData() {
  const group = (await db.select().from(groups).limit(1))[0];

  if (!group) {
    return { group: null, members: [] as { id: string; name: string; email: string }[], categories: [] };
  }

  const members = await db
    .select({ id: users.id, name: users.name, email: users.email })
    .from(groupMembers)
    .innerJoin(users, eq(users.id, groupMembers.userId))
    .where(eq(groupMembers.groupId, group.id));

  const categories = await getBudgetCategories(group.id);

  return { group, members, categories };
}