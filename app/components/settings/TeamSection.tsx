import { Users } from "lucide-react";
import { AVATAR_COLORS } from "~/lib/dashboard-format";

export function TeamSection({ members }: { members: { id: string; name: string; email: string }[] }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="flex items-center gap-2 px-5 py-3" style={{ background: "#0e3d2c" }}>
        <Users size={15} color="#ffffff" />
        <p className="text-sm font-medium text-white">Members</p>
      </div>

      <div className="p-5">
        <p className="mb-4 text-xs text-muted-foreground">
          This fund is limited to {members.length} designated members.
        </p>
        <div className="space-y-3">
          {members.map((m, i) => (
            <div key={m.id} className="flex items-center gap-3">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium text-white"
                style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
              >
                {m.name.slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm">{m.name}</p>
                <p className="truncate text-xs text-muted-foreground">{m.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}