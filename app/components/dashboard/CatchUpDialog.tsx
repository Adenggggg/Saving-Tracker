import { useEffect, useState } from "react";
import { useFetcher, useRevalidator } from "react-router";
import { X, Wallet, ArrowRight } from "lucide-react";
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
  const [amountInput, setAmountInput] = useState(String(weeklyAmount));

  useEffect(() => {
    if (open) {
      setAmountInput(String(weeklyAmount));
    }
  }, [open, weeklyAmount]);

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

  const amount = Number(amountInput) || 0;
  const weeksCovered = Math.min(Math.floor(amount / weeklyAmount), missedWeeks.length);
  const coveredWeeks = missedWeeks.slice(0, weeksCovered);
  const remainder = amount - weeksCovered * weeklyAmount;
  const dueCovered = coveredWeeks.filter((w) => w.status === "due").length;
  const advanceCovered = coveredWeeks.length - dueCovered;

  function setWeeks(n: number) {
    const clamped = Math.max(0, Math.min(n, missedWeeks.length));
    setAmountInput(String(clamped * weeklyAmount));
  }

  function handleSubmit() {
    if (weeksCovered === 0) {
      showToast(`Enter at least ${peso(weeklyAmount)} to cover one week.`, "error");
      return;
    }
    fetcher.submit(
      {
        userId: memberId,
        groupId,
        entries: coveredWeeks.map((w) => ({ weekStart: w.weekStart, amount: weeklyAmount })),
      },
      { method: "post", action: "/api/catch-up", encType: "application/json" }
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
          Enter how much {memberName} is paying — this covers as many weeks as it can, earliest first.
        </p>

        <label className="mb-1.5 block text-xs font-semibold" style={{ color: "#0e3d2c" }}>
          Amount Paid (₱)
        </label>
        <input
          type="number"
          min="0"
          step={weeklyAmount}
          value={amountInput}
          onChange={(e) => setAmountInput(e.target.value)}
          className="w-full rounded-lg border-2 px-3 py-2 text-lg font-semibold outline-none"
          style={{ borderColor: "#d8d2c2", color: "#0e3d2c" }}
        />

        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={() => setWeeks(weeksCovered - 1)}
            className="rounded-md border border-border px-2 py-1 text-xs hover:bg-muted"
          >
            − week
          </button>
          <button
            onClick={() => setWeeks(weeksCovered + 1)}
            className="rounded-md border border-border px-2 py-1 text-xs hover:bg-muted"
          >
            + week
          </button>
          <span className="text-xs text-muted-foreground">(₱{weeklyAmount} / week)</span>
        </div>

        <div className="mt-4 rounded-lg p-3" style={{ background: "#eef4ef" }}>
          {weeksCovered === 0 ? (
            <p className="text-xs" style={{ color: "#b23b3b" }}>
              Not enough for a full week yet.
            </p>
          ) : (
            <>
              <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "#0e3d2c" }}>
                <Wallet size={15} />
                Covers {weeksCovered} week{weeksCovered === 1 ? "" : "s"}
                {dueCovered > 0 && advanceCovered > 0 && (
                  <span className="text-xs font-normal text-muted-foreground">
                    ({dueCovered} due + {advanceCovered} in advance)
                  </span>
                )}
              </div>
              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                Week {coveredWeeks[0].weekNum} · {formatShortDate(coveredWeeks[0].weekStart)}
                {coveredWeeks.length > 1 && (
                  <>
                    <ArrowRight size={11} />
                    Week {coveredWeeks[coveredWeeks.length - 1].weekNum} ·{" "}
                    {formatShortDate(coveredWeeks[coveredWeeks.length - 1].weekStart)}
                  </>
                )}
              </div>
            </>
          )}
          {remainder > 0 && (
            <p className="mt-1.5 text-xs" style={{ color: "#b23b3b" }}>
              {peso(remainder)} left over — not enough for another full week.
            </p>
          )}
          {weeksCovered === missedWeeks.length && missedWeeks.length > 0 && (
            <p className="mt-1.5 text-xs text-muted-foreground">
              That's every available week — fully caught up and paid ahead.
            </p>
          )}
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
            disabled={fetcher.state !== "idle" || weeksCovered === 0}
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