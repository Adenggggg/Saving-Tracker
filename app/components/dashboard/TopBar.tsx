import { useState } from "react";
import { Menu, QrCode } from "lucide-react";
import { QRCodeModal } from "~/components/QRCodeModal";

export function TopBar({
  daysUntilChristmas,
  onMenuClick,
}: {
  daysUntilChristmas: number;
  onMenuClick: () => void;
}) {
  const [qrOpen, setQrOpen] = useState(false);

  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <button className="rounded-md p-1.5 hover:bg-muted md:hidden" onClick={onMenuClick} aria-label="Open menu">
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2 text-xs sm:text-sm" style={{ color: "#b23b3b" }}>
          <span className="whitespace-nowrap">Days until Christmas: {daysUntilChristmas}</span>
        </div>
      </div>

      <button
        onClick={() => setQrOpen(true)}
        className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90 sm:text-sm"
        style={{ background: "#0e3d2c" }}
      >
        <QrCode size={16} />
        <span className="hidden sm:inline">Scan to Pay</span>
      </button>

      <QRCodeModal open={qrOpen} onClose={() => setQrOpen(false)} />
    </div>
  );
}