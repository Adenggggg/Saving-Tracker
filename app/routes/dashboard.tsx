import { useState } from "react";
import { useLoaderData } from "react-router";
import { loadDashboardData } from "~/lib/dashboard-loader.server";
import { usePushReminders } from "~/lib/use-push-reminders";
import {
  daysUntilChristmas,
  formatLongDate,
  weekNumberSinceStart,
} from "~/lib/dashboard-format";

import { Sidebar } from "~/components/dashboard/Sidebar";
import { TopBar } from "~/components/dashboard/TopBar";
import { HeroBanner } from "~/components/dashboard/HeroBanner";
import { StatCards } from "~/components/dashboard/StatCards";
import { PartyProgress } from "~/components/dashboard/PartyProgress";
import { FundBreakdown } from "~/components/dashboard/FundBreakdown";
import { ContributionStatus } from "~/components/dashboard/ContributionStatus";
import { NoGroupYet } from "~/components/dashboard/NoGroupYet";

export async function loader() {
  return loadDashboardData();
}

export default function Dashboard() {
  const { group, members, paidUserIds, weekStart, totalSaved } = useLoaderData<typeof loader>();
  const { permission, enablePush } = usePushReminders();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!group) return <NoGroupYet />;

  const goalAmount = group.goalAmount ?? 0;
  const goalPct = goalAmount ? Math.min(100, Math.round((totalSaved / goalAmount) * 100)) : 0;
  const remaining = Math.max(0, goalAmount - totalSaved);
  const weekNum = weekNumberSinceStart((group.createdAt as unknown as string) ?? weekStart, weekStart);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#f7f6f2" }}>
      <Sidebar title={group.name} open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="h-screen flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        <TopBar
          daysUntilChristmas={daysUntilChristmas()}
          onEnableReminders={enablePush}
          remindersEnabled={permission === "granted"}
          remindersSupported={permission !== "unsupported"}
          onMenuClick={() => setMenuOpen(true)}
        />

        <HeroBanner title={group.name} dateLabel={formatLongDate(weekStart)} />

        <StatCards
          totalSaved={totalSaved}
          weeklyAmount={group.weeklyAmount}
          remaining={remaining}
          weekNum={weekNum}
        />

        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <PartyProgress goalAmount={goalAmount} goalPct={goalPct} weekNum={weekNum} />
          <FundBreakdown goalAmount={goalAmount} />
        </div>

        <ContributionStatus
          members={members}
          paidUserIds={paidUserIds}
          weekNum={weekNum}
          groupId={group.id}
          weeklyAmount={group.weeklyAmount}
          weekStart={weekStart}
        />
      </main>
    </div>
  );
}