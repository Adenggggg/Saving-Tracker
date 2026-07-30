export function HistoryHeader({ hideLabel = false }: { hideLabel?: boolean }) {
  if (hideLabel) return null;

  return (
    <p className="mb-6 text-xs font-semibold tracking-[0.15em]" style={{ color: "#b23b3b" }}>
      ARCHIVE &amp; RECORDS
    </p>
  );
}