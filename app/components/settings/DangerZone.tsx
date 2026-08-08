import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { AlertTriangle } from "lucide-react";
import { useToast } from "~/components/Toast";

export function DangerZone({
  groupId,
  groupName,
  isAuthenticated,
}: {
  groupId: string;
  groupName: string;
  isAuthenticated: boolean;
}) {
  const fetcher = useFetcher<{ ok: boolean; reason?: string }>();
  const { showToast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const canConfirm = confirmText.trim() === groupName;

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.ok) {
        showToast("All contributions were cleared.", "success");
      } else {
        showToast(fetcher.data.reason ?? "Couldn't reset the fund.", "error");
      }
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <div className="overflow-hidden rounded-2xl shadow-sm" style={{ border: "1px solid #f3c9c9" }}>
      <div className="flex items-center gap-2 px-5 py-3" style={{ background: "#fbeaea" }}>
        <AlertTriangle size={15} style={{ color: "#b23b3b" }} />
        <p className="text-sm font-medium" style={{ color: "#b23b3b" }}>
          Danger Zone
        </p>
      </div>

      <div className="space-y-3 bg-white p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Reset Fund Data</p>
            <p className="text-xs text-muted-foreground">
              Permanently deletes every recorded contribution. Members and the fund goal stay intact.
            </p>
          </div>
          <button
            onClick={() => setConfirmOpen(true)}
            disabled={!isAuthenticated}
            className="shrink-0 rounded-full px-4 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            style={{ background: "#b23b3b" }}
          >
            Reset
          </button>
        </div>
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-lg">
            <p className="text-sm font-semibold" style={{ color: "#b23b3b" }}>
              This can't be undone
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Type <strong>{groupName}</strong> below to confirm you want to permanently delete every
              recorded contribution.
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={groupName}
              className="mt-3 w-full rounded-lg border-2 px-3 py-2 text-sm outline-none"
              style={{ borderColor: "#f3c9c9" }}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setConfirmOpen(false);
                  setConfirmText("");
                }}
                className="rounded-full px-4 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <fetcher.Form
                method="post"
                action="/api/reset-fund"
                onSubmit={() => {
                  setConfirmOpen(false);
                  setConfirmText("");
                }}
              >
                <input type="hidden" name="groupId" value={groupId} />
                <button
                  type="submit"
                  disabled={!canConfirm}
                  className="rounded-full px-4 py-1.5 text-xs font-medium text-white disabled:opacity-40"
                  style={{ background: "#b23b3b" }}
                >
                  Permanently Reset
                </button>
              </fetcher.Form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}