import { LayoutDashboard, Users, History, Settings, Gift, X } from "lucide-react";

const NAV = [
  { Icon: LayoutDashboard, label: "Dashboard" },
  { Icon: Users, label: "Members" },
  { Icon: History, label: "History" },
  { Icon: Settings, label: "Settings" },
];

export function Sidebar({
  title,
  open,
  onClose,
}: {
  title: string;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Backdrop, mobile only, shown when the sidebar is open */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 shrink-0 flex-col border-r border-border bg-white p-4 pt-6 transition-transform duration-200 ease-out md:static md:z-auto md:w-60 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "#0f3d2e" }}>
              <Gift size={18} color="#ffffff" />
            </div>
            <span className="text-sm font-semibold">{title}</span>
          </div>
          <button className="p-1 md:hidden" onClick={onClose} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>
        <nav className="space-y-2">
          {NAV.map(({ Icon, label }, i) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm"
              style={
                i === 0
                  ? { background: "#0f3d2e", color: "#ffffff", fontWeight: 500 }
                  : { color: "#8a8a8a" }
              }
            >
              <Icon size={18} />
              {label}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}