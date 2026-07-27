import { peso } from "~/lib/dashboard-format";

// Adjust these percentages any time — they always add up against whatever the current goal is.
const CATEGORIES = [
  { label: "Food & Catering", share: 0.48, color: "#0f3d2e" },
  { label: "Venue & Decor", share: 0.3, color: "#b23b3b" },
  { label: "Gifts & Prizes", share: 0.22, color: "#c9a227" },
];

export function FundBreakdown({ goalAmount }: { goalAmount: number }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="mb-4 text-xs font-medium tracking-wide text-muted-foreground">FUND BREAKDOWN</p>
      <div className="space-y-4">
        {CATEGORIES.map((row) => (
          <div key={row.label} className="flex items-center gap-3">
            <div className="h-8 w-1 rounded-full" style={{ background: row.color }} />
            <div className="flex-1">
              <p className="text-sm">{row.label}</p>
              <p className="text-sm font-medium">{peso(Math.round(goalAmount * row.share))}</p>
            </div>
            <span className="text-xs text-muted-foreground">Budgeted</span>
          </div>
        ))}
      </div>
    </div>
  );
}
