import { useEffect, useRef, useState } from "react";
import { Link, useFetcher, useRevalidator } from "react-router";
import { History, Lock, Undo2 } from "lucide-react";
import { AVATAR_COLORS, TOTAL_WEEKS } from "~/lib/dashboard-format";
import { CatchUpDialog } from "~/components/dashboard/CatchUpDialog";
import { useToast } from "~/components/Toast";
import { ConfirmDialog } from "~/components/ConfirmDialog";

type Member = { id: string; name: string; email: string };
type MissedWeek = { weekNum: number; weekStart: string };

function fireConfetti(originX: number, originY: number) {
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.left = "0";
  canvas.style.top = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "9999";
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }
  ctx.scale(dpr, dpr);

  const colors = ["#b23b3b", "#1f7a4d", "#e7a83b", "#3b6db2", "#8a4fb2"];
  const count = 60;
  const particles = Array.from({ length: count }).map(() => {
    const angle = (Math.PI / 2) + (Math.random() - 0.5) * (Math.PI * 0.9);
    const speed = 4 + Math.random() * 6;
    return {
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: -Math.abs(Math.sin(angle) * speed) - 2,
      size: 4 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.3,
      shape: Math.random() > 0.5 ? "rect" : "circle",
      life: 1,
    };
  });

  const gravity = 0.18;
  const drag = 0.995;
  let frame = 0;
  const maxFrames = 90;

  function tick() {
    if (!ctx) return;
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let anyAlive = false;
    for (const p of particles) {
      p.vx *= drag;
      p.vy = p.vy * drag + gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.life = Math.max(0, 1 - frame / maxFrames);

      if (p.life <= 0) continue;
      anyAlive = true;

      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      if (p.shape === "rect") {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    if (anyAlive && frame < maxFrames) {
      requestAnimationFrame(tick);
    } else {
      canvas.remove();
    }
  }

  requestAnimationFrame(tick);
}

export function ContributionStatus({
  members,
  paidUserIds,
  contributionIdThisWeek,
  weekNum,
  groupId,
  weeklyAmount,
  missedWeeksByMember,
  isAuthenticated,
}: {
  members: Member[];
  paidUserIds: string[];
  contributionIdThisWeek: Record<string, string>;
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
            contributionId={contributionIdThisWeek[member.id]}
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
  contributionId,
  color,
  groupId,
  weeklyAmount,
  missedWeeks,
  isAuthenticated,
}: {
  member: Member;
  paid: boolean;
  contributionId?: string;
  color: string;
  groupId: string;
  weeklyAmount: number;
  missedWeeks: MissedWeek[];
  isAuthenticated: boolean;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [undoConfirmOpen, setUndoConfirmOpen] = useState(false);
  const undoFetcher = useFetcher<{ ok: boolean; reason?: string }>();
  const revalidator = useRevalidator();
  const { showToast } = useToast();
  const behindCount = missedWeeks.length;

  const rowRef = useRef<HTMLDivElement>(null);
  const wasPaidRef = useRef(paid);

  // Fire confetti the moment this row transitions from unpaid -> paid,
  // regardless of whether that happened via the dialog's own fetcher.
  useEffect(() => {
    if (!wasPaidRef.current && paid && rowRef.current) {
      const rect = rowRef.current.getBoundingClientRect();
      fireConfetti(rect.left + rect.width * 0.85, rect.top + rect.height / 2);
    }
    wasPaidRef.current = paid;
  }, [paid]);

  useEffect(() => {
    if (undoFetcher.state === "idle" && undoFetcher.data) {
      if (undoFetcher.data.ok) {
        showToast(`Undid ${member.name}'s payment for this week.`, "success");
        revalidator.revalidate();
      } else {
        showToast(undoFetcher.data.reason ?? "Couldn't undo the payment.", "error");
      }
    }
  }, [undoFetcher.state, undoFetcher.data]);

  function handleUndo() {
    setUndoConfirmOpen(false);
    if (!contributionId) return;
    undoFetcher.submit({ contributionId }, { method: "post", action: "/api/undo-payment" });
  }

  return (
    <div ref={rowRef} className="flex flex-wrap items-center justify-between gap-2 border-b border-border py-3 last:border-0">
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
        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-full px-4 py-1.5 text-xs font-medium" style={{ background: "#e7f5ee", color: "#1f7a4d" }}>
            Paid
          </span>
          {isAuthenticated && contributionId && (
            <button
              onClick={() => setUndoConfirmOpen(true)}
              disabled={undoFetcher.state !== "idle"}
              title={`Undo ${member.name}'s payment`}
              aria-label={`Undo ${member.name}'s payment`}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-[#fbeaea] disabled:opacity-50"
              style={{ color: "#b23b3b" }}
            >
              <Undo2 size={14} />
            </button>
          )}

          <ConfirmDialog
            open={undoConfirmOpen}
            title="Undo this payment?"
            message={`This removes ${member.name}'s payment for this week. This can't be undone.`}
            confirmLabel="Undo Payment"
            confirmColor="#b23b3b"
            onConfirm={handleUndo}
            onCancel={() => setUndoConfirmOpen(false)}
          />
        </div>
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