import { useMemo, useState } from "react";
import { useLoaderData } from "react-router";
import { Menu } from "lucide-react";
import { loadHistoryData } from "~/lib/history-loader.server";
import { Sidebar } from "~/components/dashboard/Sidebar";
import { SnowBackground } from "~/components/snowbackground";
import { HistoryHeader } from "~/components/history/HistoryHeader";
import { HistoryFilters, type ActivityFilter } from "~/components/history/HistoryFilters";
import { Timeline } from "~/components/history/Timeline";
import { HistoryStatsFooter } from "~/components/history/HistoryStatsFooter";
import { NoGroupYet } from "~/components/dashboard/NoGroupYet";

export async function loader() {
  return loadHistoryData();
}

export default function HistoryPage() {
  const { group, members, entries, totalContributed } = useLoaderData<typeof loader>();
  const [menuOpen, setMenuOpen] = useState(false);

  const [memberFilter, setMemberFilter] = useState("all");
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      if (activityFilter !== "all" && entry.type !== activityFilter) return false;

      if (memberFilter !== "all") {
        if (entry.type !== "contribution") return false;
        if (entry.memberId !== memberFilter) return false;
      }

      const entryDate = entry.at.slice(0, 10);
      if (startDate && entryDate < startDate) return false;
      if (endDate && entryDate > endDate) return false;

      return true;
    });
  }, [entries, activityFilter, memberFilter, startDate, endDate]);

  if (!group) return <NoGroupYet />;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#f7f6f2" }}>
      <Sidebar title={group.name} open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="relative h-screen flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        <SnowBackground />

        <div className="relative z-10">
          <div className="mb-1 flex items-center gap-3">
            <button
              className="rounded-md p-1.5 hover:bg-muted md:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <p className="text-xs font-semibold tracking-[0.15em] md:hidden" style={{ color: "#b23b3b" }}>
              ARCHIVE &amp; RECORDS
            </p>
          </div>

          <div className="hidden md:block">
            <HistoryHeader />
          </div>
          <div className="md:hidden">
            <HistoryHeader hideLabel />
          </div>

          <div className="sm:sticky sm:top-0 sm:z-20 mb-6 sm:-mx-6 sm:bg-[#f7f6f2]/95 sm:px-6 sm:pb-2 sm:pt-1 sm:backdrop-blur-sm md:-mx-8 md:px-8">
            <HistoryFilters
              members={members}
              memberFilter={memberFilter}
              onMemberChange={setMemberFilter}
              activityFilter={activityFilter}
              onActivityChange={setActivityFilter}
              startDate={startDate}
              onStartDateChange={setStartDate}
              endDate={endDate}
              onEndDateChange={setEndDate}
            />
          </div>

          <Timeline entries={filteredEntries} />

          <HistoryStatsFooter totalContributed={totalContributed} />
        </div>
      </main>
    </div>
  );
}