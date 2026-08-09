import { useEffect, useState } from "react";
import { useFetcher, useRevalidator } from "react-router";
import { Gift, Star, CheckCircle2, Undo2 } from "lucide-react";
import { peso } from "~/lib/dashboard-format";
import type { TimelineEntry as TimelineEntryType } from "~/lib/history-loader.server";
import { useToast } from "~/components/Toast";
import { ConfirmDialog } from "~/components/ConfirmDialog";

const ACCENTS = [
  { icon: "#0e3d2c", iconBg: "#0e3d2c", cardBg: "#ffffff", bar: "#0e3d2c", dot: "#0e3d2c" },
  { icon: "#8a6d1f", iconBg: "#c9a227", cardBg: "#ffffff", bar: "#c9a227", dot: "#c9a227" },
];

export function TimelineEntry({
  entry,
  accentIndex = 0,
  isAuthenticated = false,
}: {
  entry: TimelineEntryType;
  accentIndex?: number;
  isAuthenticated?: boolean;
}) {
  const accent = ACCENTS[accentIndex % ACCENTS.length];
  const fetcher = useFetcher<{ ok: boolean; reason?: string }>();
  const revalidator = useRevalidator();
  const { showToast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleUndo() {
    setConfirmOpen(false);
    fetcher.submit(
      { contributionId: entry.type === "contribution" ? entry.id : "" },
      { method: "post", action: "/api/undo-payment" }
    );
  }

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.ok) {
        showToast("Payment undone.", "success");
        revalidator.revalidate();
      } else {
        showToast(fetcher.data.reason ?? "Couldn't undo the payment.", "error");
      }
    }
  }, [fetcher.state, fetcher.data]);

  if (entry.type === "milestone") {
    return (
      <div className="relative overflow-hidden rounded-2xl p-5 text-white" style={{ background: "linear-gradient(135deg, #0e3d2c, #163f2e)" }}>
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
    <div className="relative overflow-hidden rounded-2xl bg-white p-5 pl-6 shadow-sm">
      <div className="absolute bottom-0 left-0 top-0 w-1.5" style={{ background: accent.bar }} />
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
            style={{ background: accent.iconBg }}
          >
            <Gift size={16} color="#ffffff" />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: accent.icon }}>
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

        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <p className="text-base font-bold" style={{ color: accent.icon }}>
            {peso(entry.amount)}
          </p>
          {isAuthenticated && (
            <button
              onClick={() => setConfirmOpen(true)}
              disabled={fetcher.state !== "idle"}
              className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              <Undo2 size={11} />
              Undo
            </button>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Undo this payment?"
        message={`This permanently removes ${entry.memberName}'s ${peso(entry.amount)} payment for this week. This can't be undone.`}
        confirmLabel="Undo Payment"
        confirmColor="#b23b3b"
        onConfirm={handleUndo}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}

export { ACCENTS };