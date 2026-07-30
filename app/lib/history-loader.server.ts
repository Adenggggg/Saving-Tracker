import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { groups, groupMembers, users, contributions } from "../../db/schema";

export type TimelineEntry =
  | {
      type: "contribution";
      id: string;
      memberId: string;
      memberName: string;
      amount: number;
      at: string;
    }
  | {
      type: "milestone";
      id: string;
      percent: number;
      totalAtMilestone: number;
      at: string;
    };

const MILESTONE_THRESHOLDS = [25, 50, 75, 100];

export async function loadHistoryData() {
  const group = (await db.select().from(groups).limit(1))[0];

  if (!group) {
    return { group: null, members: [] as { id: string; name: string }[], entries: [] as TimelineEntry[], totalContributed: 0 };
  }

  const members = await db
    .select({ id: users.id, name: users.name })
    .from(groupMembers)
    .innerJoin(users, eq(users.id, groupMembers.userId))
    .where(eq(groupMembers.groupId, group.id));

  const memberNameById = new Map(members.map((m) => [m.id, m.name]));

  const allContributions = await db
    .select()
    .from(contributions)
    .where(eq(contributions.groupId, group.id));

  const sorted = [...allContributions].sort(
    (a, b) => new Date(a.paidAt).getTime() - new Date(b.paidAt).getTime()
  );

  const goalAmount = group.goalAmount ?? 0;
  const entries: TimelineEntry[] = [];
  let runningTotal = 0;
  let nextThresholdIndex = 0;

  for (const c of sorted) {
    runningTotal += c.amount;

    entries.push({
      type: "contribution",
      id: c.id,
      memberId: c.userId,
      memberName: memberNameById.get(c.userId) ?? "Unknown member",
      amount: c.amount,
      at: new Date(c.paidAt).toISOString(),
    });

    if (goalAmount > 0) {
      while (
        nextThresholdIndex < MILESTONE_THRESHOLDS.length &&
        runningTotal >= (MILESTONE_THRESHOLDS[nextThresholdIndex] / 100) * goalAmount
      ) {
        const percent = MILESTONE_THRESHOLDS[nextThresholdIndex];
        entries.push({
          type: "milestone",
          id: `milestone-${percent}`,
          percent,
          totalAtMilestone: runningTotal,
          at: new Date(c.paidAt).toISOString(),
        });
        nextThresholdIndex++;
      }
    }
  }

  entries.reverse();

  return {
    group,
    members,
    entries,
    totalContributed: runningTotal,
  };
}