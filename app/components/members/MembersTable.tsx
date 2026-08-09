import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { BellRing } from "lucide-react";
import type { MemberRow as MemberRowType } from "~/lib/members-loader.server";
import { MemberRow } from "~/components/members/MemberRow";
import { useToast } from "~/components/Toast";
import { ConfirmDialog } from "~/components/ConfirmDialog";

export function MembersTable({
  members,
  groupId,
  pendingCount,
  isAuthenticated,
}: {
  members: MemberRowType[];
  groupId: string;
  pendingCount: number;
  isAuthenticated: boolean;
}) {
  const fetcher = useFetcher<{ ok: boolean; sentCount?: number; reason?: string }>();
  const { showToast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.ok) {
        const count = fetcher.data.sentCount ?? 0;
        if (count === 0) {
          showToast(fetcher.data.reason ?? "Everyone has already paid this week.", "info");
        } else {
          showToast(
            `Sent ${count} reminder${count === 1 ? "" : "s"}.${fetcher.data.reason ? " " + fetcher.data.reason : ""}`,
            "success"
          );
        }
      } else {
        showToast(fetcher.data.reason ?? "Couldn't send reminders.", "error");
      }
    }
  }, [fetcher.state, fetcher.data]);

  function handleConfirm() {
    setConfirmOpen(false);
    fetcher.submit({ groupId }, { method: "post", action: "/api/remind-all" });
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm font-medium">All Members</p>
        <button
          onClick={() => setConfirmOpen(true)}
          disabled={fetcher.state !== "idle" || pendingCount === 0}
          className="flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          style={{ background: "#b23b3b" }}
        >
          <BellRing size={13} />
          {fetcher.state !== "idle" ? "Sending…" : `Remind All${pendingCount > 0 ? ` (${pendingCount})` : ""}`}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="border-b border-border text-xs font-medium tracking-wide text-muted-foreground">
              <th className="pb-3 pr-4 font-medium">MEMBER IDENTITY</th>
              <th className="pb-3 pr-4 font-medium">STATUS</th>
              <th className="pb-3 pr-4 font-medium">TOTAL CONTRIBUTED</th>
              <th className="pb-3 pr-4 font-medium">LAST ACTIVITY</th>
              <th className="pb-3 font-medium">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, i) => (
              <MemberRow key={member.id} member={member} index={i} isAuthenticated={isAuthenticated} />
            ))}
          </tbody>
        </table>
      </div>

      {members.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">No members match your search.</p>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        Showing {members.length} of {members.length} members
      </p>

      <ConfirmDialog
        open={confirmOpen}
        title="Remind everyone?"
        message={`This sends an email reminder to all ${pendingCount} member(s) who haven't paid this week.`}
        confirmLabel="Remind All"
        confirmColor="#b23b3b"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}