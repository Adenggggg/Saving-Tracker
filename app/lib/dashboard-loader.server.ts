import { eq, and } from "drizzle-orm";
import { db } from "../../db/client";
import { groups, groupMembers, users, contributions } from "../../db/schema";
import { currentWeekStart, listWeeksSinceStart, addDaysToDateStr, TOTAL_WEEKS } from "~/lib/dashboard-format";
import { getBudgetCategories } from "~/lib/budget-categories.server";

const ADVANCE_WEEKS_ALLOWED = 4;

type PayableWeek = { weekNum: number; weekStart: string; status: "due" | "advance" };

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
      missedWeeksByMember: {} as Record<string, PayableWeek[]>,
      remainingWeeksByMember: {} as Record<string, PayableWeek[]>,
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

  // Normal catch-up / advance window (unchanged)
  const lookaheadUpTo = addDaysToDateStr(weekStart, ADVANCE_WEEKS_ALLOWED * 7);
  const allWeeks = listWeeksSinceStart(lookaheadUpTo);

  // Full schedule for "Pay in Full": every week up to each member's share of the goal
  const fullSchedule = listWeeksSinceStart(addDaysToDateStr(weekStart, 52 * 7)).filter(
    (w) => w.weekNum <= TOTAL_WEEKS
  );

  const missedWeeksByMember: Record<string, PayableWeek[]> = {};
  const remainingWeeksByMember: Record<string, PayableWeek[]> = {};

  for (const member of members) {
    const paidWeekStarts = new Set(
      allContributions.filter((c) => c.userId === member.id).map((c) => c.weekStart)
    );

    const toStatus = (w: { weekNum: number; weekStart: string }): PayableWeek => ({
      ...w,
      status: w.weekStart <= weekStart ? "due" : "advance",
    });

    missedWeeksByMember[member.id] = allWeeks
      .filter((w) => !paidWeekStarts.has(w.weekStart))
      .map(toStatus);

    remainingWeeksByMember[member.id] = fullSchedule
      .filter((w) => !paidWeekStarts.has(w.weekStart))
      .map(toStatus);
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
    remainingWeeksByMember,
  };
}

export type DashboardData = Awaited<ReturnType<typeof loadDashboardData>>;