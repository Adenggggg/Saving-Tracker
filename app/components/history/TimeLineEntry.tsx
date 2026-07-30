import { Gift, Star, CheckCircle2 } from "lucide-react";
import { peso } from "~/lib/dashboard-format";
import type { TimelineEntry as TimelineEntryType } from "~/lib/history-loader.server";

const ACCENTS = [
  { icon: "#0f3d2e", iconBg: "#e7f0ea", dot: "#0f3d2e" },
  { icon: "#8a6d1f", iconBg: "#f7edd2", dot: "#c9a227" },
];

export function TimelineEntry({ entry, accentIndex = 0 }: { entry: TimelineEntryType; accentIndex?: number }) {
  const accent = ACCENTS[accentIndex % ACCENTS.length];

  if (entry.type === "milestone") {
    return (
      <div className="relative overflow-hidden rounded-2xl p-5 text-white" style={{ background: "linear-gradient(135deg, #0f3d2e, #163f2e)" }}>
        <Star
          className="pointer-events-none absolute -right-2 -top-2 opacity-15"
          size={90}
          fill="#c9a227"
          color="#c9a227"
          aria-hidden="true"
        />
        <div className="relative">
          <div className="flex items-center gap-2">
            <Star size={16} color="#c9a227" fill="#c9a227" />
            <p className="text-sm font-semibold">Milestone Reached · {entry.percent}% Goal Achieved</p>
          </div>
          <p className="mt-1 text-xs text-white/70">
            We reached {peso(entry.totalAtMilestone)} — {entry.percent}% of the fund is now locked in.
          </p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full" style={{ width: `${entry.percent}%`, background: "#c9a227" }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
            style={{ background: accent.iconBg }}
          >
            <Gift size={16} style={{ color: accent.icon }} />
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: accent.icon }}>
              Contribution
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Weekly contribution from {entry.memberName}
            </p>
            <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <CheckCircle2 size={12} style={{ color: "#1f7a4d" }} />
              Verified by System
            </p>
          </div>
        </div>
        <p className="text-base font-semibold" style={{ color: accent.icon }}>
          {peso(entry.amount)}
        </p>
      </div>
    </div>
  );
}

export { ACCENTS };