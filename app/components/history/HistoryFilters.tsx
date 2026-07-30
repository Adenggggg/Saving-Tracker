import { useState } from "react";
import { SlidersHorizontal, ChevronDown, Calendar, Tag, User } from "lucide-react";

export type ActivityFilter = "all" | "contribution" | "milestone";

function FieldLabel({ icon: Icon, children }: { icon: typeof Calendar; children: React.ReactNode }) {
  return (
    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold" style={{ color: "#0e3d2c" }}>
      <Icon size={13} />
      {children}
    </label>
  );
}

function FilterFields({
  members,
  memberFilter,
  onMemberChange,
  activityFilter,
  onActivityChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
}: HistoryFiltersProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      <div>
        <FieldLabel icon={Calendar}>Date Range</FieldLabel>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full min-w-0 rounded-lg border-2 px-2.5 py-2 text-sm outline-none"
            style={{ borderColor: "#d8d2c2" }}
          />
          <span className="hidden text-muted-foreground sm:inline">–</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full min-w-0 rounded-lg border-2 px-2.5 py-2 text-sm outline-none"
            style={{ borderColor: "#d8d2c2" }}
          />
        </div>
      </div>

      <div>
        <FieldLabel icon={Tag}>Activity Type</FieldLabel>
        <select
          value={activityFilter}
          onChange={(e) => onActivityChange(e.target.value as ActivityFilter)}
          className="w-full rounded-lg border-2 px-3 py-2 text-sm outline-none"
          style={{ borderColor: "#d8d2c2" }}
        >
          <option value="all">All Activities</option>
          <option value="contribution">Contributions</option>
          <option value="milestone">Milestones</option>
        </select>
      </div>

      <div>
        <FieldLabel icon={User}>Member</FieldLabel>
        <select
          value={memberFilter}
          onChange={(e) => onMemberChange(e.target.value)}
          className="w-full rounded-lg border-2 px-3 py-2 text-sm outline-none"
          style={{ borderColor: "#d8d2c2" }}
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
  );
}

type HistoryFiltersProps = {
  members: { id: string; name: string }[];
  memberFilter: string;
  onMemberChange: (value: string) => void;
  activityFilter: ActivityFilter;
  onActivityChange: (value: ActivityFilter) => void;
  startDate: string;
  onStartDateChange: (value: string) => void;
  endDate: string;
  onEndDateChange: (value: string) => void;
};

export function HistoryFilters(props: HistoryFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeCount =
    (props.activityFilter !== "all" ? 1 : 0) +
    (props.memberFilter !== "all" ? 1 : 0) +
    (props.startDate ? 1 : 0) +
    (props.endDate ? 1 : 0);

  return (
    <>
      <div className="mb-4 sm:hidden">
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-white shadow-sm"
          style={{ background: "#0e3d2c" }}
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal size={16} />
            Filters
            {activeCount > 0 && (
              <span
                className="rounded-full px-2 py-0.5 text-xs font-medium"
                style={{ background: "#c9a227", color: "#ffffff" }}
              >
                {activeCount}
              </span>
            )}
          </span>
          <ChevronDown size={16} className={`transition-transform ${mobileOpen ? "rotate-180" : ""}`} />
        </button>

        {mobileOpen && (
          <div className="mt-2 rounded-2xl bg-white p-4 shadow-sm">
            <FilterFields {...props} />
          </div>
        )}
      </div>

      <div className="mb-6 hidden overflow-hidden rounded-2xl shadow-sm sm:block">
        <div className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white" style={{ background: "#0e3d2c" }}>
          <SlidersHorizontal size={15} />
          Filters
        </div>
        <div className="bg-white p-5">
          <FilterFields {...props} />
        </div>
      </div>
    </>
  );
}