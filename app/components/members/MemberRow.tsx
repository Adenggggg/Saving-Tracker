import { useFetcher } from "react-router";
import { peso } from "~/lib/dashboard-format";
import type { MemberRow as MemberRowType } from "~/lib/members-loader.server";
import { AVATAR_COLORS } from "~/lib/dashboard-format";

function formatLastActivity(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function MemberRow({ member, index }: { member: MemberRowType; index: number }) {
  const fetcher = useFetcher<{ ok: boolean; reason?: string }>();
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const reminded = fetcher.state === "idle" && fetcher.data?.ok;

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
        {!member.paidThisWeek && (
          <fetcher.Form method="post" action="/api/remind-member">
            <input type="hidden" name="userId" value={member.id} />
            <button
              type="submit"
              disabled={fetcher.state !== "idle"}
              className="rounded-full px-4 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ background: "#b23b3b" }}
            >
              {fetcher.state !== "idle" ? "Sending…" : reminded ? "Sent ✓" : "Remind"}
            </button>
          </fetcher.Form>
        )}
        {fetcher.data?.ok === false && (
          <p className="mt-1 text-xs text-muted-foreground">{fetcher.data.reason}</p>
        )}
      </td>
    </tr>
  );
}