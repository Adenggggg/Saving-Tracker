import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { Settings2 } from "lucide-react";
import { useToast } from "~/components/Toast";

export function FundConfiguration({
  groupId,
  name,
  weeklyAmount,
  goalAmount,
}: {
  groupId: string;
  name: string;
  weeklyAmount: number;
  goalAmount: number;
}) {
  const fetcher = useFetcher<{ ok: boolean; reason?: string }>();
  const { showToast } = useToast();
  const [nameInput, setNameInput] = useState(name);
  const [weeklyInput, setWeeklyInput] = useState(String(weeklyAmount));
  const [goalInput, setGoalInput] = useState(String(goalAmount));

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.ok) {
        showToast("Fund settings saved.", "success");
      } else {
        showToast(fetcher.data.reason ?? "Couldn't save changes.", "error");
      }
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="flex items-center gap-2 px-5 py-3" style={{ background: "#0e3d2c" }}>
        <Settings2 size={15} color="#ffffff" />
        <p className="text-sm font-medium text-white">Fund Configuration</p>
      </div>

      <fetcher.Form
        method="post"
        action="/api/update-fund"
        className="space-y-4 p-5"
        onSubmit={(e) => {
          const noChange =
            nameInput.trim() === name &&
            Number(weeklyInput) === weeklyAmount &&
            Number(goalInput) === goalAmount;

          if (noChange) {
            e.preventDefault();
            showToast("No changes to save.", "info");
          }
        }}
      >
        <input type="hidden" name="groupId" value={groupId} />

        <div>
          <label className="mb-1.5 block text-xs font-semibold" style={{ color: "#0e3d2c" }}>
            Fund Name
          </label>
          <input
            type="text"
            name="name"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            className="w-full rounded-lg border-2 px-3 py-2 text-sm outline-none"
            style={{ borderColor: "#d8d2c2" }}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold" style={{ color: "#0e3d2c" }}>
              Weekly Contribution (₱)
            </label>
            <input
              type="number"
              name="weeklyAmount"
              min="1"
              value={weeklyInput}
              onChange={(e) => setWeeklyInput(e.target.value)}
              className="w-full rounded-lg border-2 px-3 py-2 text-sm outline-none"
              style={{ borderColor: "#d8d2c2" }}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold" style={{ color: "#0e3d2c" }}>
              Total Goal Amount (₱)
            </label>
            <input
              type="number"
              name="goalAmount"
              min="1"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              className="w-full rounded-lg border-2 px-3 py-2 text-sm outline-none"
              style={{ borderColor: "#d8d2c2" }}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={fetcher.state !== "idle"}
            className="rounded-full px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: "#0e3d2c" }}
          >
            {fetcher.state !== "idle" ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </fetcher.Form>
    </div>
  );
}