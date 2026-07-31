import { peso } from "~/lib/dashboard-format";

const COLORS = ["#0f3d2e", "#b23b3b", "#c9a227", "#3f6b8f", "#8f3f5f"];

export function FundBreakdown({
  goalAmount,
  categories,
}: {
  goalAmount: number;
  categories: { id: string; label: string; percent: number }[];
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="mb-4 text-xs font-medium tracking-wide text-muted-foreground">FUND BREAKDOWN</p>
      <div className="space-y-4">
        {categories.map((cat, i) => (
          <div key={cat.id} className="flex items-center gap-3">
            <div className="h-8 w-1 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
            <div className="flex-1">
              <p className="text-sm">{cat.label}</p>
              <p className="text-sm font-medium">
                {peso(Math.round((goalAmount * cat.percent) / 100))}
              </p>
            </div>
            <span className="text-xs text-muted-foreground">Budgeted</span>
          </div>
        ))}
      </div>
    </div>
  );
}