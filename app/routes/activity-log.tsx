import { useState } from "react";
import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { Menu, ScrollText, TrendingUp, Clock } from "lucide-react";
import { db } from "../../db/client";
import { groups } from "../../db/schema";
import { getRecentAuditLogs, getAuditStats } from "~/lib/audit.server";
import { getCurrentUser } from "~/lib/auth.server";
import { Sidebar } from "~/components/dashboard/Sidebar";
import { ActivityLog } from "~/components/settings/ActivityLog";
import { NoGroupYet } from "~/components/dashboard/NoGroupYet";

export async function loader({ request }: LoaderFunctionArgs) {
  const group = (await db.select().from(groups).limit(1))[0];
  const currentUser = await getCurrentUser(request);

  if (!group) {
    return { group: null, auditLogs: [], stats: null, currentUser };
  }

  const [logs, stats] = await Promise.all([
    getRecentAuditLogs(group.id, 50),
    getAuditStats(group.id),
  ]);

  const auditLogs = logs.map((l) => ({ ...l, createdAt: l.createdAt.toISOString() }));

  return {
    group,
    auditLogs,
    stats: {
      total: stats.total,
      mostActiveName: stats.mostActiveName,
      mostActiveCount: stats.mostActiveCount,
      lastActivityAt: stats.lastActivityAt ? stats.lastActivityAt.toISOString() : null,
    },
    currentUser,
  };
}

function formatRelative(iso: string | null) {
  if (!iso) return "—";
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function ActivityLogPage() {
  const { group, auditLogs, stats, currentUser } = useLoaderData<typeof loader>();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!group) return <NoGroupYet />;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#f7f6f2" }}>
      <Sidebar title={group.name} open={menuOpen} onClose={() => setMenuOpen(false)} currentUser={currentUser} />

      <main className="h-screen flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        <div className="mb-5 flex items-center gap-3">
          <button className="rounded-md p-1.5 hover:bg-muted md:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu size={20} />
          </button>
          <div>
            <p className="text-xs font-semibold tracking-[0.15em]" style={{ color: "#b23b3b" }}>
              ACTIVITY LOG
            </p>
            {/* <p className="mt-1 text-xs text-muted-foreground">
              Every action that changed real fund data — who did it, and when.
            </p> */}
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground">
              <ScrollText size={14} />
              TOTAL ACTIONS LOGGED
            </div>
            <p className="mt-2 text-2xl font-semibold" style={{ color: "#0e3d2c" }}>
              {stats?.total ?? 0}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground">
              <TrendingUp size={14} />
              MOST ACTIVE MEMBER
            </div>
            <p className="mt-2 truncate text-2xl font-semibold" style={{ color: "#0e3d2c" }}>
              {stats?.mostActiveName ?? "—"}
            </p>
            {stats?.mostActiveName && (
              <p className="mt-1 text-xs text-muted-foreground">{stats.mostActiveCount} action(s)</p>
            )}
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground">
              <Clock size={14} />
              LAST ACTIVITY
            </div>
            <p className="mt-2 text-2xl font-semibold" style={{ color: "#0e3d2c" }}>
              {formatRelative(stats?.lastActivityAt ?? null)}
            </p>
          </div>
        </div>

        <ActivityLog entries={auditLogs} />
      </main>
    </div>
  );
}