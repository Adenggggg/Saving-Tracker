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
      <div className="p-8 text-center">
        <p className="text-sm text-muted-foreground">No activity matches your filters yet.</p>
      </div>
    );
  }

  let lastDayKeyDesktop = "";
  let lastDayKeyMobile = "";

  return (
    <div className="relative">
      {/* Desktop: center line */}
      <div
        className="absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 md:block"
        style={{ background: "#e5e2da" }}
        aria-hidden="true"
      />

      {/* Mobile: left-side line */}
      <div
        className="absolute bottom-0 left-[15px] top-0 w-px md:hidden"
        style={{ background: "#e5e2da" }}
        aria-hidden="true"
      />

      <div className="space-y-4 md:space-y-6">
        {entries.map((entry, i) => {
          const dayKey = entry.at.slice(0, 10);
          const accentIndex = i % 2;
          const dotColor = entry.type === "milestone" ? "#c9a227" : ACCENTS[accentIndex].dot;

          const showDayPillDesktop = dayKey !== lastDayKeyDesktop;
          lastDayKeyDesktop = dayKey;
          const showDayPillMobile = dayKey !== lastDayKeyMobile;
          lastDayKeyMobile = dayKey;

          const onLeft = i % 2 === 0;

          return (
            <div key={entry.id}>
              {/* Mobile layout: left dot + line, card to the right */}
              <div className="md:hidden">
                {showDayPillMobile && (
                  <div className="mb-4 ml-8 flex justify-start">
                    <span
                      className="rounded-full px-3 py-1 text-xs font-medium"
                      style={{ background: "#fbeaea", color: "#b23b3b" }}
                    >
                      {dayLabel(entry.at)}
                    </span>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <span
                    className="relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: dotColor }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="mb-1 text-xs text-muted-foreground">{formatTime(entry.at)}</p>
                    <TimelineEntry entry={entry} accentIndex={accentIndex} />
                  </div>
                </div>
              </div>

              {/* Desktop layout: alternating sides around the center line */}
              <div className="hidden md:block">
                {showDayPillDesktop && (
                  <div className="mb-6 flex justify-center">
                    <span
                      className="rounded-full px-4 py-1 text-xs font-medium shadow-sm"
                      style={{ background: "#fbeaea", color: "#b23b3b" }}
                    >
                      {dayLabel(entry.at)}
                    </span>
                  </div>
                )}
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
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
            </div>
          );
        })}
      </div>
    </div>
  );
}