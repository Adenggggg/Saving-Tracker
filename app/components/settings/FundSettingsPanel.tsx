import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { Settings2, PieChart, Utensils, Landmark, Gift, CheckCircle2, Save } from "lucide-react";
import { useToast } from "~/components/Toast";
import { ConfirmDialog } from "~/components/ConfirmDialog";

type Category = { id: string; label: string; description: string | null; percent: number };

const COLORS = ["#0e3d2c", "#b23b3b", "#c9a227", "#3f6b8f", "#8f3f5f"];
const ICONS = [Utensils, Landmark, Gift];

export function FundSettingsPanel({
  groupId,
  name,
  weeklyAmount,
  goalAmount,
  categories,
  isAuthenticated,
}: {
  groupId: string;
  name: string;
  weeklyAmount: number;
  goalAmount: number;
  categories: Category[];
  isAuthenticated: boolean;
}) {
  const fundFetcher = useFetcher<{ ok: boolean; reason?: string }>();
  const categoriesFetcher = useFetcher<{ ok: boolean; reason?: string }>();
  const { showToast } = useToast();

  const [nameInput, setNameInput] = useState(name);
  const [weeklyInput, setWeeklyInput] = useState(String(weeklyAmount));
  const [goalInput, setGoalInput] = useState(String(goalAmount));
  const [rows, setRows] = useState(categories.map((c) => ({ ...c, description: c.description ?? "" })));
  const [confirmOpen, setConfirmOpen] = useState(false);

  const total = rows.reduce((sum, r) => sum + (Number(r.percent) || 0), 0);

  const originalRows = categories.map((c) => ({ ...c, description: c.description ?? "" }));
  const noChange =
    nameInput.trim() === name &&
    Number(weeklyInput) === weeklyAmount &&
    Number(goalInput) === goalAmount &&
    JSON.stringify(rows) === JSON.stringify(originalRows);

  const saving = fundFetcher.state !== "idle" || categoriesFetcher.state !== "idle";

  useEffect(() => {
    if (fundFetcher.state === "idle" && categoriesFetcher.state === "idle" && fundFetcher.data && categoriesFetcher.data) {
      if (fundFetcher.data.ok && categoriesFetcher.data.ok) {
        showToast("Settings saved.", "success");
      } else {
        showToast(fundFetcher.data.reason ?? categoriesFetcher.data.reason ?? "Couldn't save changes.", "error");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fundFetcher.state, categoriesFetcher.state, fundFetcher.data, categoriesFetcher.data]);

  function updateRow(id: string, field: "label" | "description" | "percent", value: string) {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, [field]: field === "percent" ? Number(value) || 0 : value } : r
      )
    );
  }

  function handleSaveClick() {
    if (!isAuthenticated) {
      showToast("Please log in with your registered email to do this.", "error");
      return;
    }
    if (noChange) {
      showToast("No changes to save.", "info");
      return;
    }
    if (!nameInput.trim() || Number(weeklyInput) <= 0 || Number(goalInput) <= 0) {
      showToast("Please fill in valid values for the fund configuration.", "error");
      return;
    }
    if (total !== 100) {
      showToast(`Breakdown percentages must add up to 100% (currently ${total}%).`, "error");
      return;
    }
    setConfirmOpen(true);
  }

  function handleConfirmSave() {
    setConfirmOpen(false);

    fundFetcher.submit(
      { groupId, name: nameInput.trim(), weeklyAmount: weeklyInput, goalAmount: goalInput },
      { method: "post", action: "/api/update-fund" }
    );

    categoriesFetcher.submit(
      { categories: rows },
      { method: "post", action: "/api/update-budget-categories", encType: "application/json" }
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Fund Configuration card */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="flex items-center gap-2 px-5 py-3" style={{ background: "#0e3d2c" }}>
            <Settings2 size={15} color="#ffffff" />
            <p className="text-sm font-medium text-white">Fund Configuration</p>
          </div>

          <div className="space-y-4 p-5">
            <div>
              <label className="mb-1.5 block text-xs font-semibold" style={{ color: "#0e3d2c" }}>
                Fund Name
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                disabled={!isAuthenticated}
                className="w-full rounded-lg border-2 px-3 py-2 text-sm outline-none disabled:opacity-60"
                style={{ borderColor: "#d8d2c2" }}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold" style={{ color: "#0e3d2c" }}>
                Weekly Contribution (₱)
              </label>
              <input
                type="number"
                min="1"
                value={weeklyInput}
                onChange={(e) => setWeeklyInput(e.target.value)}
                disabled={!isAuthenticated}
                className="w-full rounded-lg border-2 px-3 py-2 text-sm outline-none disabled:opacity-60"
                style={{ borderColor: "#d8d2c2" }}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold" style={{ color: "#0e3d2c" }}>
                Total Goal Amount (₱)
              </label>
              <input
                type="number"
                min="1"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                disabled={!isAuthenticated}
                className="w-full rounded-lg border-2 px-3 py-2 text-sm outline-none disabled:opacity-60"
                style={{ borderColor: "#d8d2c2" }}
              />
            </div>
          </div>
        </div>

        {/* Fund Breakdown card */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="flex items-center gap-2 px-5 py-3" style={{ background: "#0e3d2c" }}>
            <PieChart size={15} color="#ffffff" />
            <p className="text-sm font-medium text-white">Fund Breakdown</p>
          </div>

          <div className="space-y-3 p-5">
            {rows.map((row, i) => {
              const Icon = ICONS[i % ICONS.length];
              const color = COLORS[i % COLORS.length];
              return (
                <div key={row.id} className="relative overflow-hidden rounded-xl p-3 pl-4" style={{ background: "#faf9f6" }}>
                  <div className="absolute bottom-0 left-0 top-0 w-1" style={{ background: color }} />
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-1.5">
                        <Icon size={13} style={{ color }} />
                        <input
                          type="text"
                          value={row.label}
                          onChange={(e) => updateRow(row.id, "label", e.target.value)}
                          disabled={!isAuthenticated}
                          className="min-w-0 flex-1 bg-transparent text-xs font-semibold uppercase tracking-wide outline-none disabled:opacity-70"
                          style={{ color }}
                        />
                      </div>
                      <input
                        type="text"
                        value={row.description}
                        onChange={(e) => updateRow(row.id, "description", e.target.value)}
                        placeholder="Optional description…"
                        disabled={!isAuthenticated}
                        className="w-full truncate bg-transparent text-xs text-muted-foreground outline-none disabled:opacity-70"
                      />
                    </div>
                    <div className="flex shrink-0 items-baseline gap-0.5">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={row.percent}
                        onChange={(e) => updateRow(row.id, "percent", e.target.value)}
                        disabled={!isAuthenticated}
                        className="w-12 bg-transparent text-right text-xl font-bold outline-none disabled:opacity-70"
                        style={{ color }}
                      />
                      <span className="text-sm font-semibold" style={{ color }}>%</span>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="flex items-center justify-between rounded-xl p-3" style={{ background: "#faf9f6" }}>
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
          </div>
        </div>
      </div>

      {/* Shared save action for both cards */}
      <button
        onClick={handleSaveClick}
        disabled={saving || !isAuthenticated}
        className="flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
        style={{ background: "#b23b3b" }}
      >
        <Save size={16} />
        {saving ? "SAVING…" : "SAVE CHANGES"}
      </button>

      <ConfirmDialog
        open={confirmOpen}
        title="Save these changes?"
        message="This updates the fund's name, weekly amount, goal, and budget breakdown for everyone in the group."
        confirmLabel="Save Changes"
        confirmColor="#b23b3b"
        onConfirm={handleConfirmSave}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}