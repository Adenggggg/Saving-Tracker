import { desc, eq } from "drizzle-orm";
import { db } from "../../db/client";
import { auditLogs } from "../../db/schema";

export async function logAudit(params: {
  groupId: string;
  actorUserId: string;
  actorName: string;
  action: string;
  detail: string;
}) {
  await db.insert(auditLogs).values(params);
}

export async function getRecentAuditLogs(groupId: string, limit = 20) {
  return db
    .select()
    .from(auditLogs)
    .where(eq(auditLogs.groupId, groupId))
    .orderBy(desc(auditLogs.createdAt))
    .limit(limit);
}

export async function getAuditStats(groupId: string) {
  const all = await db.select().from(auditLogs).where(eq(auditLogs.groupId, groupId));

  const countByActor = new Map<string, number>();
  for (const log of all) {
    countByActor.set(log.actorName, (countByActor.get(log.actorName) ?? 0) + 1);
  }

  const mostActive = [...countByActor.entries()].sort((a, b) => b[1] - a[1])[0];

  return {
    total: all.length,
    mostActiveName: mostActive?.[0] ?? null,
    mostActiveCount: mostActive?.[1] ?? 0,
    lastActivityAt: all[0] ? all.reduce((latest, l) => (l.createdAt > latest ? l.createdAt : latest), all[0].createdAt) : null,
  };
}