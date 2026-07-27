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
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-medium tracking-wide text-muted-foreground">TOTAL SAVED</p>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
            <i className="ti ti-wallet text-base" aria-hidden="true" />
          </div>
        </div>
        <p className="text-3xl font-semibold" style={{ color: "#0f3d2e" }}>
          {peso(totalSaved)}
          <span className="ml-1 text-sm font-normal text-muted-foreground">PHP</span>
        </p>
        <span
          className="mt-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs"
          style={{ background: "#e7f5ee", color: "#1f7a4d" }}
        >
          <i className="ti ti-trending-up text-sm" aria-hidden="true" />
          {totalSaved === 0 ? "Starting Phase" : `Week ${weekNum} of ${TOTAL_WEEKS}`}
        </span>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground">WEEKLY GOAL</p>
        <p className="text-3xl font-semibold">{peso(weeklyAmount)}</p>
        <div className="my-3 border-t border-border" />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Per Member</span>
          <i className="ti ti-star text-sm" style={{ color: "#c9a227" }} aria-hidden="true" />
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm">
        <div className="absolute left-0 top-0 h-full w-1" style={{ background: "#b23b3b" }} />
        <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground">REMAINING</p>
        <p className="text-3xl font-semibold" style={{ color: "#b23b3b" }}>
          {peso(remaining)}
        </p>
        <p className="mt-3 text-xs italic text-muted-foreground">
          "Every peso brings us closer to the feast."
        </p>
      </div>
    </div>
  );
}
