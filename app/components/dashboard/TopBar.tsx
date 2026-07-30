import { User, Menu } from "lucide-react";

export function TopBar({
  daysUntilChristmas,
  onMenuClick,
}: {
  daysUntilChristmas: number;
  onMenuClick: () => void;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <button className="rounded-md p-1.5 hover:bg-muted md:hidden" onClick={onMenuClick} aria-label="Open menu">
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2 text-xs sm:text-sm" style={{ color: "#b23b3b" }}>
          <span className="whitespace-nowrap">Days until Christmas: {daysUntilChristmas}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden text-right leading-tight sm:block">
          <p className="text-sm font-medium">Claus Manager</p>
          <p className="text-xs text-muted-foreground">Admin Access</p>
        </div>
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
          style={{ background: "#002b17" }}
        >
          <User size={16} color="#ffffff" />
        </div>
      </div>
    </div>
  );
}