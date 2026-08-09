import { eq, and } from "drizzle-orm";
import { db } from "../../db/client";
import { groups, groupMembers, users, contributions } from "../../db/schema";
import { currentWeekStart, listWeeksSinceStart } from "~/lib/dashboard-format";
import { getBudgetCategories } from "~/lib/budget-categories.server";

export async function loadDashboardData() {
  const group = (await db.select().from(groups).limit(1))[0];

  if (!group) {
    return {
      group: null,
      members: [],
      paidUserIds: [],
      contributionIdThisWeek: {} as Record<string, string>,
      weekStart: currentWeekStart(),
      totalSaved: 0,
      categories: [],
      missedWeeksByMember: {} as Record<string, { weekNum: number; weekStart: string }[]>,
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

  const contributionIdThisWeek: Record<string, string> = {};
  for (const row of paidRows) {
    contributionIdThisWeek[row.userId] = row.id;
  }

  const allWeeks = listWeeksSinceStart(weekStart);
  const missedWeeksByMember: Record<string, { weekNum: number; weekStart: string }[]> = {};

  for (const member of members) {
    const paidWeekStarts = new Set(
      allContributions.filter((c) => c.userId === member.id).map((c) => c.weekStart)
    );
    missedWeeksByMember[member.id] = allWeeks.filter((w) => !paidWeekStarts.has(w.weekStart));
  }

  return {
    group,
    members,
    paidUserIds: paidRows.map((r) => r.userId),
    contributionIdThisWeek,
    weekStart,
    totalSaved,
    categories,
    missedWeeksByMember,
  };
}

export type DashboardData = Awaited<ReturnType<typeof loadDashboardData>>;