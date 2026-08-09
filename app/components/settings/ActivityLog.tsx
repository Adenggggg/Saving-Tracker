import { ScrollText } from "lucide-react";

type LogEntry = {
  id: string;
  actorName: string;
  action: string;
  detail: string;
  createdAt: string;
};

function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function ActivityLog({ entries }: { entries: LogEntry[] }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="flex items-center gap-2 px-5 py-3" style={{ background: "#0e3d2c" }}>
        <ScrollText size={15} color="#ffffff" />
        <p className="text-sm font-medium text-white">Activity Log</p>
      </div>

      <div className="p-5">
        {entries.length === 0 ? (
          <p className="py-6 text-center text-xs text-muted-foreground">No activity recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div key={entry.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                <p className="text-xs">{entry.detail}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{formatTimestamp(entry.createdAt)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}