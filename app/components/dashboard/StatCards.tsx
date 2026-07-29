import { Wallet, TrendingUp, Star } from "lucide-react";
import { peso, TOTAL_WEEKS } from "~/lib/dashboard-format";

export function StatCards({
  totalSaved,
  weeklyAmount,
  remaining,
  weekNum,
}: {
  totalSaved: number;
  weeklyAmount: number;
  remaining: number;
  weekNum: number;
}) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-medium tracking-wide text-muted-foreground">TOTAL SAVED</p>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
            <Wallet size={16} />
          </div>
        </div>
        <p className="text-2xl font-semibold sm:text-3xl" style={{ color: "#0f3d2e" }}>
          {peso(totalSaved)}
          <span className="ml-1 text-sm font-normal text-muted-foreground">PHP</span>
        </p>
        <span
          className="mt-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs"
          style={{ background: "#e7f5ee", color: "#1f7a4d" }}
        >
          <TrendingUp size={14} />
          {totalSaved === 0 ? "Starting Phase" : `Week ${weekNum} of ${TOTAL_WEEKS}`}
        </span>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
        <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground">WEEKLY GOAL</p>
        <p className="text-2xl font-semibold sm:text-3xl">{peso(weeklyAmount)}</p>
        <div className="my-3 border-t border-border" />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Per Member</span>
          <Star size={14} color="#c9a227" />
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm sm:col-span-2 sm:p-5 md:col-span-1">
        <div className="absolute left-0 top-0 h-full w-1" style={{ background: "#b23b3b" }} />
        <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground">REMAINING</p>
        <p className="text-2xl font-semibold sm:text-3xl" style={{ color: "#b23b3b" }}>
          {peso(remaining)}
        </p>
        <p className="mt-3 text-xs italic text-muted-foreground">
          "Every peso brings us closer to the feast."
        </p>
      </div>
    </div>
  );
}