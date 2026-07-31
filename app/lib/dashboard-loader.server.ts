import { eq, and } from "drizzle-orm";
import { db } from "../../db/client";
import { groups, groupMembers, users, contributions } from "../../db/schema";
import { currentWeekStart } from "~/lib/dashboard-format";
import { getBudgetCategories } from "~/lib/budget-categories.server";

export async function loadDashboardData() {
  const group = (await db.select().from(groups).limit(1))[0];

  if (!group) {
    return {
      group: null,
      members: [],
      paidUserIds: [],
      weekStart: currentWeekStart(),
      totalSaved: 0,
      categories: [],
    };
  }

  const members = await db
    .select({ id: users.id, name: users.name, email: users.email })
    .from(groupMembers)
    .innerJoin(users, eq(users.id, groupMembers.userId))
    .where(eq(groupMembers.groupId, group.id));

  const weekStart = currentWeekStart();

  const paidRows = await db
    .select()
    .from(contributions)
    .where(and(eq(contributions.groupId, group.id), eq(contributions.weekStart, weekStart)));

  const allContributions = await db
    .select()
    .from(contributions)
    .where(eq(contributions.groupId, group.id));

  const totalSaved = allContributions.reduce((sum, c) => sum + c.amount, 0);
  const categories = await getBudgetCategories(group.id);

  return {
    group,
    members,
    paidUserIds: paidRows.map((r) => r.userId),
    weekStart,
    totalSaved,
    categories,
  };
}

export type DashboardData = Awaited<ReturnType<typeof loadDashboardData>>;