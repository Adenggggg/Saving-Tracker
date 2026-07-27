export function TopBar({
  daysUntilChristmas,
  onEnableReminders,
  remindersEnabled,
  remindersSupported,
}: {
  daysUntilChristmas: number;
  onEnableReminders: () => void;
  remindersEnabled: boolean;
  remindersSupported: boolean;
}) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-[#b23b3b]">
        <i className="ti ti-calendar-event text-base" aria-hidden="true" />
        <span>Days until Christmas: {daysUntilChristmas}</span>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={onEnableReminders} disabled={remindersEnabled || !remindersSupported}>
          <i className="ti ti-bell text-lg text-[#444]" aria-hidden="true" />
        </button>
        <div className="flex items-center gap-2">
          <div className="text-right leading-tight">
            <p className="text-sm font-medium">Claus Manager</p>
            <p className="text-xs text-muted-foreground">Admin Access</p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: "#002b17" }}>
            <i className="ti ti-user text-sm text-white" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}
