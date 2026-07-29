import { TrendingUp, CheckCircle2 } from "lucide-react";

export function RegistryOverview({
  totalMembers,
  paidThisWeekCount,
}: {
  totalMembers: number;
  paidThisWeekCount: number;
}) {
  const contributionRate = totalMembers ? Math.round((paidThisWeekCount / totalMembers) * 1000) / 10 : 0;
  const onTrack = paidThisWeekCount === totalMembers;

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <p className="text-sm text-muted-foreground">Total Members</p>
        <p className="mt-1 text-2xl font-semibold">{totalMembers}</p>
        <p className="mt-2 flex items-center gap-1 text-xs" style={{ color: "#1f7a4d" }}>
          <TrendingUp size={14} />
          Fixed roster
        </p>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <p className="text-sm text-muted-foreground">Contribution Rate</p>
        <p className="mt-1 text-2xl font-semibold">{contributionRate}%</p>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full"
            style={{ width: `${contributionRate}%`, background: "#c9a227" }}
          />
        </div>
      </div>

      <div className="rounded-2xl p-5 text-white" style={{ background: "#0f3d2e" }}>
        <p className="text-sm text-white/80">Weekly Target Status</p>
        <p className="mt-1 text-xl font-semibold">{onTrack ? "On Track" : "Behind"}</p>
        <p className="mt-2 flex items-center gap-1 text-sm text-white/90">
          <CheckCircle2 size={16} />
          {paidThisWeekCount}/{totalMembers} paid this week
        </p>
      </div>
    </div>
  );
}