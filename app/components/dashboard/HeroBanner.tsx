export function HeroBanner({ title, dateLabel }: { title: string; dateLabel: string }) {
  return (
    <div
      className="relative mb-6 overflow-hidden rounded-2xl p-8 text-white"
      style={{ background: "linear-gradient(135deg, #0f3d2e, #163f2e)" }}
    >
      <i className="ti ti-snowflake absolute -right-6 -top-6 text-[220px] opacity-10" aria-hidden="true" />
      <p className="mb-3 text-xs font-medium tracking-[0.2em]" style={{ color: "#c9a227" }}>
        — SAVINGS SEASON
      </p>
      <h1 className="mb-4 text-5xl font-semibold leading-none">{title}</h1>
      <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm">
        <i className="ti ti-calendar text-sm" aria-hidden="true" />
        {dateLabel}
      </span>
    </div>
  );
}
