import { useFetcher } from "react-router";
import { AVATAR_COLORS, TOTAL_WEEKS } from "~/lib/dashboard-format";

type Member = { id: string; name: string; email: string };

export function ContributionStatus({
  members,
  paidUserIds,
  weekNum,
  groupId,
  weeklyAmount,
  weekStart,
}: {
  members: Member[];
  paidUserIds: string[];
  weekNum: number;
  groupId: string;
  weeklyAmount: number;
  weekStart: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Contribution Status</p>
          <p className="text-xs text-muted-foreground">
            Weekly tracking for week {weekNum} of {TOTAL_WEEKS}
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <i className="ti ti-history text-sm" aria-hidden="true" />
          View History
        </div>
      </div>
      <div className="mt-3">
        {members.map((member, i) => (
          <MemberRow
            key={member.id}
            member={member}
            paid={paidUserIds.includes(member.id)}
            color={AVATAR_COLORS[i % AVATAR_COLORS.length]}
            groupId={groupId}
            weeklyAmount={weeklyAmount}
            weekStart={weekStart}
          />
        ))}
      </div>
    </div>
  );
}

function MemberRow({
  member,
  paid,
  color,
  groupId,
  weeklyAmount,
  weekStart,
}: {
  member: Member;
  paid: boolean;
  color: string;
  groupId: string;
  weeklyAmount: number;
  weekStart: string;
}) {
  const fetcher = useFetcher();

  return (
    <div className="flex items-center justify-between border-b border-border py-3 last:border-0">
      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium text-white"
          style={{ background: color }}
        >
          {member.name.slice(0, 1).toUpperCase()}
        </div>
        <div>
          <p className="text-sm">{member.name}</p>
          <p className="flex items-center gap-1 text-xs" style={{ color: paid ? "#1f7a4d" : "#b23b3b" }}>
            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: paid ? "#1f7a4d" : "#b23b3b" }} />
            {paid ? "Paid this week" : "Pending payment"}
          </p>
        </div>
      </div>

      {paid ? (
        <span className="rounded-full px-4 py-1.5 text-xs font-medium" style={{ background: "#e7f5ee", color: "#1f7a4d" }}>
          Paid
        </span>
      ) : (
        <fetcher.Form method="post" action="/api/contribute">
          <input type="hidden" name="userId" value={member.id} />
          <input type="hidden" name="groupId" value={groupId} />
          <input type="hidden" name="amount" value={weeklyAmount} />
          <input type="hidden" name="weekStart" value={weekStart} />
          <button
            type="submit"
            className="rounded-full px-4 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: "#b23b3b" }}
          >
            Mark Paid
          </button>
        </fetcher.Form>
      )}
    </div>
  );
}
