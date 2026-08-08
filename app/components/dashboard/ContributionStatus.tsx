import { useState } from "react";
import { Link } from "react-router";
import { History, Lock } from "lucide-react";
import { AVATAR_COLORS, TOTAL_WEEKS } from "~/lib/dashboard-format";
import { CatchUpDialog } from "~/components/dashboard/CatchUpDialog";

type Member = { id: string; name: string; email: string };
type MissedWeek = { weekNum: number; weekStart: string };

export function ContributionStatus({
  members,
  paidUserIds,
  weekNum,
  groupId,
  weeklyAmount,
  missedWeeksByMember,
  isAuthenticated,
}: {
  members: Member[];
  paidUserIds: string[];
  weekNum: number;
  groupId: string;
  weeklyAmount: number;
  missedWeeksByMember: Record<string, MissedWeek[]>;
  isAuthenticated: boolean;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium">Contribution Status</p>
          <p className="text-xs text-muted-foreground">
            Weekly tracking for week {weekNum} of {TOTAL_WEEKS}
          </p>
        </div>
        <Link
          to="/history"
          className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <History size={14} />
          View History
        </Link>
      </div>

      {!isAuthenticated && (
        <p className="mb-3 flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs" style={{ background: "#fbeaea", color: "#b23b3b" }}>
          <Lock size={12} />
          Log in with your registered email to mark a payment.
        </p>
      )}

      <div className="mt-3">
        {members.map((member, i) => (
          <MemberRow
            key={member.id}
            member={member}
            paid={paidUserIds.includes(member.id)}
            color={AVATAR_COLORS[i % AVATAR_COLORS.length]}
            groupId={groupId}
            weeklyAmount={weeklyAmount}
            missedWeeks={missedWeeksByMember[member.id] ?? []}
            isAuthenticated={isAuthenticated}
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
  missedWeeks,
  isAuthenticated,
}: {
  member: Member;
  paid: boolean;
  color: string;
  groupId: string;
  weeklyAmount: number;
  missedWeeks: MissedWeek[];
  isAuthenticated: boolean;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const behindCount = missedWeeks.length;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border py-3 last:border-0">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-medium text-white"
          style={{ background: color }}
        >
          {member.name.slice(0, 1).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm">{member.name}</p>
          <p className="flex items-center gap-1 text-xs" style={{ color: paid ? "#1f7a4d" : "#b23b3b" }}>
            <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: paid ? "#1f7a4d" : "#b23b3b" }} />
            {paid
              ? "Paid this week"
              : behindCount > 1
              ? `${behindCount} weeks behind`
              : "Pending payment"}
          </p>
        </div>
      </div>

      {paid ? (
        <span className="shrink-0 rounded-full px-4 py-1.5 text-xs font-medium" style={{ background: "#e7f5ee", color: "#1f7a4d" }}>
          Paid
        </span>
      ) : (
        <>
          <button
            onClick={() => setDialogOpen(true)}
            disabled={!isAuthenticated}
            className="shrink-0 rounded-full px-4 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            style={{ background: "#b23b3b" }}
          >
            {behindCount > 1 ? "Catch Up" : "Mark Paid"}
          </button>

          <CatchUpDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            memberName={member.name}
            memberId={member.id}
            groupId={groupId}
            weeklyAmount={weeklyAmount}
            missedWeeks={missedWeeks}
          />
        </>
      )}
    </div>
  );
}