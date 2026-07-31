import { useEffect, useState } from "react";
import { X } from "lucide-react";

const TRANSITION_MS = 180;

export function QRCodeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const raf = requestAnimationFrame(() => setEntered(true));
      return () => cancelAnimationFrame(raf);
    } else {
      setEntered(false);
      const t = setTimeout(() => setMounted(false), TRANSITION_MS);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 transition-opacity"
      style={{ opacity: entered ? 1 : 0, transitionDuration: `${TRANSITION_MS}ms` }}
    >
      <div
        className="w-full max-w-xs rounded-2xl bg-white p-5 text-center shadow-lg transition-all"
        style={{
          opacity: entered ? 1 : 0,
          transform: entered ? "scale(1) translateY(0)" : "scale(0.95) translateY(8px)",
          transitionDuration: `${TRANSITION_MS}ms`,
        }}
      >
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold" style={{ color: "#0e3d2c" }}>
            Scan to Pay
          </p>
          <button onClick={onClose} aria-label="Close" className="text-muted-foreground hover:text-foreground">
            <X size={18} />
          </button>
        </div>

        <img
          src="/qr_code.jpg"
          alt="QR Ph payment code — scan with GCash, Maya, or your banking app to pay directly"
          className="mx-auto rounded-lg border border-border"
          width={240}
          height={240}
        />

        <p className="mt-3 text-xs text-muted-foreground">
          Open GCash, Maya, or your banking app and scan this code to send your weekly contribution
          directly.
        </p>

        <button
          onClick={onClose}
          className="mt-4 w-full rounded-full py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ background: "#0e3d2c" }}
        >
          Done
        </button>
      </div>
    </div>
  );
}