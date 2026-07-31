import { useEffect } from "react";
import { useFetcher } from "react-router";
import { peso } from "~/lib/dashboard-format";
import type { MemberRow as MemberRowType } from "~/lib/members-loader.server";
import { AVATAR_COLORS } from "~/lib/dashboard-format";
import { useToast } from "~/components/Toast";

function formatLastActivity(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function MemberRow({ member, index }: { member: MemberRowType; index: number }) {
  const fetcher = useFetcher<{ ok: boolean; reason?: string }>();
  const { showToast } = useToast();
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const reminded = fetcher.state === "idle" && fetcher.data?.ok;

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.ok) {
        showToast(`Reminder sent to ${member.name}.`, "success");
      } else {
        showToast(fetcher.data.reason ?? "Couldn't send the reminder.", "error");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.state, fetcher.data]);

  return (
    <tr className="border-b border-border last:border-0">
      <td className="py-4 pr-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-medium text-white"
            style={{ background: color }}
          >
            {member.name.slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{member.name}</p>
            <p className="truncate text-xs text-muted-foreground">{member.email}</p>
          </div>
        </div>
      </td>

      <td className="py-4 pr-4">
        {member.paidThisWeek ? (
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs"
            style={{ background: "#eef1ee", color: "#333" }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#1f7a4d" }} />
            Paid this week
          </span>
        ) : (
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs"
            style={{ background: "#fbeaea", color: "#b23b3b" }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#b23b3b" }} />
            Pending
          </span>
        )}
      </td>

      <td className="py-4 pr-4">
        <p className="text-sm font-medium" style={{ color: "#0f3d2e" }}>
          {peso(member.totalContributed)}
        </p>
      </td>

      <td className="py-4 pr-4">
        <p className="text-sm text-muted-foreground">{formatLastActivity(member.lastActivity)}</p>
      </td>

      <td className="py-4">
        <fetcher.Form method="post" action="/api/remind-member">
          <input type="hidden" name="userId" value={member.id} />
          <button
            type="submit"
            disabled={member.paidThisWeek || fetcher.state !== "idle"}
            className="rounded-full px-4 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            style={{ background: "#b23b3b" }}
          >
            {member.paidThisWeek
              ? "Remind"
              : fetcher.state !== "idle"
              ? "Sending…"
              : reminded
              ? "Sent ✓"
              : "Remind"}
          </button>
        </fetcher.Form>
      </td>
    </tr>
  );
}