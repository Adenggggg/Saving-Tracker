import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { PieChart, Utensils, Landmark, Gift, CheckCircle2, Save } from "lucide-react";
import { useToast } from "~/components/Toast";

type Category = { id: string; label: string; description: string | null; percent: number };

const COLORS = ["#0e3d2c", "#b23b3b", "#c9a227", "#3f6b8f", "#8f3f5f"];
const ICONS = [Utensils, Landmark, Gift];

export function BudgetBreakdownSettings({ categories }: { categories: Category[] }) {
  const fetcher = useFetcher<{ ok: boolean; reason?: string }>();
  const { showToast } = useToast();
  const [rows, setRows] = useState(categories.map((c) => ({ ...c, description: c.description ?? "" })));

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.ok) {
        showToast("Fund breakdown updated.", "success");
      } else {
        showToast(fetcher.data.reason ?? "Couldn't save the breakdown.", "error");
      }
    }
  }, [fetcher.state, fetcher.data]);

  const total = rows.reduce((sum, r) => sum + (Number(r.percent) || 0), 0);
  const original = categories.map((c) => ({ ...c, description: c.description ?? "" }));
  const noChange = JSON.stringify(rows) === JSON.stringify(original);

  function updateRow(id: string, field: "label" | "description" | "percent", value: string) {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, [field]: field === "percent" ? Number(value) || 0 : value } : r
      )
    );
  }

  function handleSubmit() {
    if (noChange) {
      showToast("No changes to save.", "info");
      return;
    }
    if (total !== 100) {
      showToast(`Percentages must add up to 100% (currently ${total}%).`, "error");
      return;
    }
    fetcher.submit(
      { categories: rows },
      { method: "post", action: "/api/update-budget-categories", encType: "application/json" }
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="flex items-center gap-2 px-5 py-3" style={{ background: "#0e3d2c" }}>
        <PieChart size={15} color="#ffffff" />
        <p className="text-sm font-medium text-white">Fund Breakdown</p>
      </div>

      <div className="space-y-3 p-4 sm:hidden">
        {rows.map((row, i) => {
          const Icon = ICONS[i % ICONS.length];
          const color = COLORS[i % COLORS.length];
          return (
            <div key={row.id} className="relative overflow-hidden rounded-xl bg-white p-3 pl-4 shadow-sm">
              <div className="absolute bottom-0 left-0 top-0 w-1" style={{ background: color }} />
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-1.5">
                    <Icon size={13} style={{ color }} />
                    <input
                      type="text"
                      value={row.label}
                      onChange={(e) => updateRow(row.id, "label", e.target.value)}
                      className="min-w-0 flex-1 bg-transparent text-xs font-semibold uppercase tracking-wide outline-none"
                      style={{ color }}
                    />
                  </div>
                  <input
                    type="text"
                    value={row.description}
                    onChange={(e) => updateRow(row.id, "description", e.target.value)}
                    placeholder="Optional description…"
                    className="w-full truncate bg-transparent text-xs text-muted-foreground outline-none"
                  />
                </div>
                <div className="flex shrink-0 items-baseline gap-0.5">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={row.percent}
                    onChange={(e) => updateRow(row.id, "percent", e.target.value)}
                    className="w-12 bg-transparent text-right text-xl font-bold outline-none"
                    style={{ color }}
                  />
                  <span className="text-sm font-semibold" style={{ color }}>%</span>
                </div>
              </div>
            </div>
          );
        })}

        <div className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} style={{ color: total === 100 ? "#1f7a4d" : "#b23b3b" }} />
            <div>
              <p className="text-sm font-medium">Total Allocation</p>
              <p className="text-xs text-muted-foreground">Must equal 100%</p>
            </div>
          </div>
          <span
            className="rounded-full px-3 py-1 text-xs font-semibold text-white"
            style={{ background: total === 100 ? "#0e3d2c" : "#b23b3b" }}
          >
            {total}%
          </span>
        </div>

        <button
          onClick={handleSubmit}
          disabled={fetcher.state !== "idle"}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ background: "#b23b3b" }}
        >
          <Save size={16} />
          {fetcher.state !== "idle" ? "SAVING…" : "SAVE CHANGES"}
        </button>
      </div>

      <div className="hidden p-5 sm:block">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {rows.map((row, i) => (
            <div key={row.id} className="rounded-xl border border-border p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="h-1 w-8 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              </div>

              <div className="mb-2 flex items-baseline gap-1">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={row.percent}
                  onChange={(e) => updateRow(row.id, "percent", e.target.value)}
                  className="w-16 rounded-md border-2 px-1.5 py-0.5 text-2xl font-bold outline-none"
                  style={{ borderColor: "#d8d2c2", color: "#0e3d2c" }}
                />
                <span className="text-lg font-semibold text-muted-foreground">%</span>
              </div>

              <input
                type="text"
                value={row.label}
                onChange={(e) => updateRow(row.id, "label", e.target.value)}
                className="mb-2 w-full rounded-md border-2 px-2 py-1 text-sm font-semibold outline-none"
                style={{ borderColor: "#d8d2c2" }}
              />

              <textarea
                value={row.description}
                onChange={(e) => updateRow(row.id, "description", e.target.value)}
                rows={2}
                placeholder="Optional description…"
                className="w-full resize-none rounded-md border-2 px-2 py-1 text-xs text-muted-foreground outline-none"
                style={{ borderColor: "#d8d2c2" }}
              />
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <p className="flex items-center gap-1 text-xs" style={{ color: total === 100 ? "#1f7a4d" : "#b23b3b" }}>
            Total: {total}% {total === 100 && "✓"}
          </p>
          <button
            onClick={handleSubmit}
            disabled={fetcher.state !== "idle"}
            className="rounded-full px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: "#0e3d2c" }}
          >
            {fetcher.state !== "idle" ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}