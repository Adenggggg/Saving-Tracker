import { eq, and } from "drizzle-orm";
import { db } from "../../db/client";
import { groups, groupMembers, users, contributions } from "../../db/schema";
import { currentWeekStart } from "~/lib/dashboard-format";

export type MemberRow = {
  id: string;
  name: string;
  email: string;
  paidThisWeek: boolean;
  totalContributed: number;
  lastActivity: string | null;
};

export async function loadMembersData() {
  const group = (await db.select().from(groups).limit(1))[0];

  if (!group) {
    return { group: null, members: [] as MemberRow[], weekStart: currentWeekStart() };
  }

  const weekStart = currentWeekStart();

  const groupUsers = await db
    .select({ id: users.id, name: users.name, email: users.email })
    .from(groupMembers)
    .innerJoin(users, eq(users.id, groupMembers.userId))
    .where(eq(groupMembers.groupId, group.id));

  const allContributions = await db
    .select()
    .from(contributions)
    .where(eq(contributions.groupId, group.id));

  const paidThisWeekIds = new Set(
    allContributions.filter((c) => c.weekStart === weekStart).map((c) => c.userId)
  );

  const members: MemberRow[] = groupUsers.map((u) => {
    const own = allContributions.filter((c) => c.userId === u.id);
    const totalContributed = own.reduce((sum, c) => sum + c.amount, 0);
    const lastActivity = own.length
      ? own.reduce((latest, c) => (c.paidAt > latest ? c.paidAt : latest), own[0].paidAt)
      : null;

    return {
      id: u.id,
      name: u.name,
      email: u.email,
      paidThisWeek: paidThisWeekIds.has(u.id),
      totalContributed,
      lastActivity: lastActivity ? new Date(lastActivity).toISOString() : null,
    };
  });

  return { group, members, weekStart };
}