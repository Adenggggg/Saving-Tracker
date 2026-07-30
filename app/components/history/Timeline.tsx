import { TimelineEntry, ACCENTS } from "~/components/history/TimeLineEntry";
import type { TimelineEntry as TimelineEntryType } from "~/lib/history-loader.server";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function dayLabel(iso: string) {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  if (sameDay(date, today)) {
    return `TODAY, ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase()}`;
  }
  if (sameDay(date, yesterday)) {
    return "YESTERDAY";
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase();
}

export function Timeline({ entries }: { entries: TimelineEntryType[] }) {
  if (entries.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-sm text-muted-foreground">No activity matches your filters yet.</p>
      </div>
    );
  }

  let lastDayKey = "";

  return (
    <div className="relative">
      <div
        className="absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 md:block"
        style={{ background: "#e5e2da" }}
        aria-hidden="true"
      />

      <div className="space-y-6">
        {entries.map((entry, i) => {
          const dayKey = entry.at.slice(0, 10);
          const showDayPill = dayKey !== lastDayKey;
          lastDayKey = dayKey;
          const onLeft = i % 2 === 0;
          const accentIndex = i % 2;
          const dotColor = entry.type === "milestone" ? "#c9a227" : ACCENTS[accentIndex].dot;

          return (
            <div key={entry.id}>
              {showDayPill && (
                <div className="sticky top-2 z-10 mb-6 flex justify-center">
                  <span
                    className="rounded-full px-4 py-1 text-xs font-medium shadow-sm"
                    style={{ background: "#fbeaea", color: "#b23b3b" }}
                  >
                    {dayLabel(entry.at)}
                  </span>
                </div>
              )}

              <div className="md:hidden">
                <p className="mb-1 text-xs text-muted-foreground">{formatTime(entry.at)}</p>
                <TimelineEntry entry={entry} accentIndex={accentIndex} />
              </div>

              <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-4">
                <div className={onLeft ? "" : "flex justify-end"}>
                  {onLeft ? (
                    <TimelineEntry entry={entry} accentIndex={accentIndex} />
                  ) : (
                    <p className="text-xs text-muted-foreground">{formatTime(entry.at)}</p>
                  )}
                </div>

                <span className="z-10 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: dotColor }} />

                <div>
                  {onLeft ? (
                    <p className="text-xs text-muted-foreground">{formatTime(entry.at)}</p>
                  ) : (
                    <TimelineEntry entry={entry} accentIndex={accentIndex} />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}