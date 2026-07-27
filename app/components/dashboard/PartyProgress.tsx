import { peso, TOTAL_WEEKS } from "~/lib/dashboard-format";

export function PartyProgress({
  goalAmount,
  goalPct,
  weekNum,
}: {
  goalAmount: number;
  goalPct: number;
  weekNum: number;
}) {
  return (
    <div
      className="rounded-2xl p-6 text-white lg:col-span-2"
      style={{ background: "linear-gradient(135deg, #0f3d2e, #163f2e)" }}
    >
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Party Progress</p>
          <p className="text-xs text-white/70">
            Targeting {peso(goalAmount)} for the Grand Christmas Party Celebration · Week {weekNum} of{" "}
            {TOTAL_WEEKS}
          </p>
        </div>
        <p className="text-sm font-medium" style={{ color: "#c9a227" }}>
          {goalPct}%
        </p>
      </div>
      <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full" style={{ width: `${goalPct}%`, background: "#c9a227" }} />
      </div>
      <div className="flex items-start gap-2 rounded-xl bg-white/10 p-3 text-xs">
        <i className="ti ti-bulb mt-0.5 text-sm" style={{ color: "#c9a227" }} aria-hidden="true" />
        <span>
          <strong>Savings Tip:</strong> Start early to avoid the December rush and maximize holiday
          discounts!
        </span>
      </div>
    </div>
  );
}
