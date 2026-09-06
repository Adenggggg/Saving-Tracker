import { useEffect, useState } from "react";
import { useFetcher, useRevalidator } from "react-router";
import { X, Wallet, Clock, TrendingUp } from "lucide-react";
import { peso, formatShortDate } from "~/lib/dashboard-format";
import { useToast } from "~/components/Toast";

type PayableWeek = { weekNum: number; weekStart: string; status: "due" | "advance" };

export function CatchUpDialog({
  open,
  onClose,
  memberName,
  memberId,
  groupId,
  weeklyAmount,
  missedWeeks,
}: {
  open: boolean;
  onClose: () => void;
  memberName: string;
  memberId: string;
  groupId: string;
  weeklyAmount: number;
  missedWeeks: PayableWeek[];
}) {
  const fetcher = useFetcher<{ ok: boolean; count?: number; reason?: string }>();
  const { showToast } = useToast();
  const revalidator = useRevalidator();

  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [amounts, setAmounts] = useState<Record<string, string>>({});

  const dueWeeks = missedWeeks.filter((w) => w.status === "due");
  const advanceWeeks = missedWeeks.filter((w) => w.status === "advance");

  useEffect(() => {
    if (open) {
      const nextSelected: Record<string, boolean> = {};
      const nextAmounts: Record<string, string> = {};
      for (const w of missedWeeks) {
        nextSelected[w.weekStart] = w.status === "due";
        nextAmounts[w.weekStart] = String(weeklyAmount);
      }
      setSelected(nextSelected);
      setAmounts(nextAmounts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.ok) {
        showToast(
          `Recorded ${fetcher.data.count} payment${fetcher.data.count === 1 ? "" : "s"} for ${memberName}.`,
          "success"
        );
        onClose();
        revalidator.revalidate();
      } else {
        showToast(fetcher.data.reason ?? "Couldn't record the payment.", "error");
      }
    }
  }, [fetcher.state, fetcher.data]);

  if (!open) return null;

  const selectedWeeks = missedWeeks.filter((w) => selected[w.weekStart]);
  const total = selectedWeeks.reduce((sum, w) => sum + (Number(amounts[w.weekStart]) || 0), 0);

  function toggle(weekStart: string) {
    setSelected((prev) => ({ ...prev, [weekStart]: !prev[weekStart] }));
  }

  function updateAmount(weekStart: string, value: string) {
    setAmounts((prev) => ({ ...prev, [weekStart]: value }));
  }

  function handleSubmit() {
    if (selectedWeeks.length === 0) {
      showToast("Select at least one week.", "error");
      return;
    }
    fetcher.submit(
      {
        userId: memberId,
        groupId,
        entries: selectedWeeks.map((w) => ({
          weekStart: w.weekStart,
          amount: Number(amounts[w.weekStart]) || 0,
        })),
      },
      { method: "post", action: "/api/catch-up", encType: "application/json" }
    );
  }

  function WeekRow({ w }: { w: PayableWeek }) {
    return (
      <label className="flex items-center gap-3 rounded-lg border border-border p-2.5">
        <input
          type="checkbox"
          checked={!!selected[w.weekStart]}
          onChange={() => toggle(w.weekStart)}
          className="h-4 w-4 shrink-0 accent-[#0e3d2c]"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm">
            Week {w.weekNum} <span className="text-muted-foreground">· {formatShortDate(w.weekStart)}</span>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <span className="text-xs text-muted-foreground">₱</span>
          <input
            type="number"
            min="1"
            value={amounts[w.weekStart] ?? ""}
            onChange={(e) => updateAmount(w.weekStart, e.target.value)}
            disabled={!selected[w.weekStart]}
            className="w-16 rounded-md border border-border px-1.5 py-1 text-right text-xs outline-none disabled:opacity-40"
          />
        </div>
      </label>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-lg">
        <div className="mb-1 flex items-center justify-between">
          <p className="text-sm font-semibold" style={{ color: "#0e3d2c" }}>
            Catch Up — {memberName}
          </p>
          <button onClick={onClose} aria-label="Close" className="text-muted-foreground hover:text-foreground">
            <X size={18} />
          </button>
        </div>
        <p className="mb-4 text-xs text-muted-foreground">
          Select which weeks to mark as paid. You can also pay ahead for upcoming weeks.
        </p>

        <div className="max-h-72 space-y-4 overflow-y-auto pr-1">
          {dueWeeks.length > 0 && (
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold" style={{ color: "#b23b3b" }}>
                <Clock size={12} />
                DUE ({dueWeeks.length})
              </p>
              <div className="space-y-2">
                {dueWeeks.map((w) => (
                  <WeekRow key={w.weekStart} w={w} />
                ))}
              </div>
            </div>
          )}

          {advanceWeeks.length > 0 && (
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold" style={{ color: "#2563a8" }}>
                <TrendingUp size={12} />
                PAY IN ADVANCE (OPTIONAL)
              </p>
              <div className="space-y-2">
                {advanceWeeks.map((w) => (
                  <WeekRow key={w.weekStart} w={w} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between rounded-lg p-3" style={{ background: "#eef4ef" }}>
          <div className="flex items-center gap-2">
            <Wallet size={15} style={{ color: "#0e3d2c" }} />
            <span className="text-xs font-medium" style={{ color: "#0e3d2c" }}>
              Total ({selectedWeeks.length} week{selectedWeeks.length === 1 ? "" : "s"})
            </span>
          </div>
          <span className="text-sm font-semibold" style={{ color: "#0e3d2c" }}>
            {peso(total)}
          </span>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-full px-4 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={fetcher.state !== "idle" || selectedWeeks.length === 0}
            className="rounded-full px-4 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: "#b23b3b" }}
          >
            {fetcher.state !== "idle" ? "Saving…" : "Mark as Paid"}
          </button>
        </div>
      </div>
    </div>
  );
}