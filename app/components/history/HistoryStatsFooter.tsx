import { Wallet, PiggyBank, PhilippinePeso, Scale } from "lucide-react";
import { peso } from "~/lib/dashboard-format";

export function HistoryStatsFooter({ totalContributed }: { totalContributed: number }) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
      <div
        className="relative overflow-hidden rounded-2xl p-4 shadow-sm sm:p-5"
        style={{ background: "#0e3d2c" }}
      >
        <PhilippinePeso
          className="pointer-events-none absolute -bottom-3 -right-3 opacity-15"
          size={72}
          color="#ffffff"
          aria-hidden="true"
        />
        <div className="relative">
          <div className="flex items-center gap-1.5 text-[10px] font-medium tracking-wide text-white/70 sm:text-xs">
            <Wallet size={13} />
            TOTAL CONTRIBUTED
          </div>
          <p className="mt-1.5 text-lg font-semibold text-white sm:mt-2 sm:text-2xl">
            {peso(totalContributed)}
          </p>
        </div>
      </div>

      <div
        className="relative overflow-hidden rounded-2xl p-4 shadow-sm sm:p-5"
        style={{ background: "#c9a227" }}
      >
        <Scale
          className="pointer-events-none absolute -bottom-3 -right-3 opacity-15"
          size={72}
          color="#ffffff"
          aria-hidden="true"
        />
        <div className="relative">
          <div className="flex items-center gap-1.5 text-[10px] font-medium tracking-wide text-white/80 sm:text-xs">
            <PiggyBank size={13} />
            CURRENT FUND
          </div>
          <p className="mt-1.5 text-lg font-semibold text-white sm:mt-2 sm:text-2xl">
            {peso(totalContributed)}
          </p>
        </div>
      </div>
    </div>
  );
}