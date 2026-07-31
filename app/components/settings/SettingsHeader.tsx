export function SettingsHeader({ hideLabel = false }: { hideLabel?: boolean }) {
  return (
    <div className="mb-6">
      {!hideLabel && (
        <p className="text-xs font-semibold tracking-[0.15em]" style={{ color: "#b23b3b" }}>
          MANAGEMENT CONSOLE
        </p>
      )}
      <p className="mt-1 text-sm font-medium" style={{ color: "#b23b3b" }}>
        Preferences &amp; Parameters
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Adjust your weekly target, goal amount, and fund name for the Christmas Party Fund.
      </p>
    </div>
  );
}