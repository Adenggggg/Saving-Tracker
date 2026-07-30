import { Wallet, PiggyBank } from "lucide-react";
import { peso } from "~/lib/dashboard-format";

export function HistoryStatsFooter({ totalContributed }: { totalContributed: number }) {
  return (
    <>
      <div className="mt-6 hidden grid-cols-1 gap-4 sm:grid sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground">
            <Wallet size={14} />
            TOTAL CONTRIBUTED
          </div>
          <p className="mt-2 text-2xl font-semibold" style={{ color: "#0f3d2e" }}>
            {peso(totalContributed)}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground">
            <PiggyBank size={14} />
            CURRENT FUND
          </div>
          <p className="mt-2 text-2xl font-semibold" style={{ color: "#0f3d2e" }}>
            {peso(totalContributed)}
          </p>
        </div>
      </div>

      <div
        className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around gap-2 border-t border-border bg-white/95 px-3 py-2.5 shadow-[0_-2px_8px_rgba(0,0,0,0.06)] backdrop-blur-sm sm:hidden"
      >
        <div className="flex items-center gap-1.5">
          <Wallet size={13} className="text-muted-foreground" />
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Contributed</span>
          <span className="text-sm font-semibold" style={{ color: "#0f3d2e" }}>
            {peso(totalContributed)}
          </span>
        </div>
        <div className="h-6 w-px bg-border" />
        <div className="flex items-center gap-1.5">
          <PiggyBank size={13} className="text-muted-foreground" />
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Fund</span>
          <span className="text-sm font-semibold" style={{ color: "#0f3d2e" }}>
            {peso(totalContributed)}
          </span>
        </div>
      </div>
    </>
  );
}