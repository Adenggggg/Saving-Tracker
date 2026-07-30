export type ActivityFilter = "all" | "contribution" | "milestone";

export function HistoryFilters({
  members,
  memberFilter,
  onMemberChange,
  activityFilter,
  onActivityChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
}: {
  members: { id: string; name: string }[];
  memberFilter: string;
  onMemberChange: (value: string) => void;
  activityFilter: ActivityFilter;
  onActivityChange: (value: ActivityFilter) => void;
  startDate: string;
  onStartDateChange: (value: string) => void;
  endDate: string;
  onEndDateChange: (value: string) => void;
}) {
  return (
    <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            Date Range
          </label>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="w-full min-w-0 rounded-lg border border-border px-2.5 py-2 text-sm text-foreground outline-none focus:border-[#0f3d2e]"
            />
            <span className="hidden text-muted-foreground sm:inline">–</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="w-full min-w-0 rounded-lg border border-border px-2.5 py-2 text-sm text-foreground outline-none focus:border-[#0f3d2e]"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Activity Type</label>
          <select
            value={activityFilter}
            onChange={(e) => onActivityChange(e.target.value as ActivityFilter)}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-[#0f3d2e]"
          >
            <option value="all">All Activities</option>
            <option value="contribution">Contributions</option>
            <option value="milestone">Milestones</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Member</label>
          <select
            value={memberFilter}
            onChange={(e) => onMemberChange(e.target.value)}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-[#0f3d2e]"
          >
            <option value="all">Everyone</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}