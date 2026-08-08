import { Link, Form, useLocation } from "react-router";
import { LayoutDashboard, Users, History, Settings, Gift, X, LogIn, LogOut } from "lucide-react";

const NAV = [
  { Icon: LayoutDashboard, label: "Dashboard", to: "/" },
  { Icon: Users, label: "Members", to: "/members" },
  { Icon: History, label: "History", to: "/history" },
  { Icon: Settings, label: "Settings", to: "/settings" },
];

export function Sidebar({
  title,
  open,
  onClose,
  currentUser,
}: {
  title: string;
  open: boolean;
  onClose: () => void;
  currentUser?: { id: string; name: string; email: string } | null;
}) {
  const location = useLocation();

  return (
    <>
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
          {NAV.map(({ Icon, label, to }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={label}
                to={to}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors ${
                  active ? "" : "hover:bg-[#e7f0ea] hover:text-[#0f3d2e]"
                }`}
                style={
                  active
                    ? { background: "#0f3d2e", color: "#ffffff", fontWeight: 500 }
                    : { color: "#8a8a8a" }
                }
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-border pt-4">
          {currentUser ? (
            <div>
              <div className="mb-2 flex items-center gap-2 px-2">
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium text-white"
                  style={{ background: "#0f3d2e" }}
                >
                  {currentUser.name.slice(0, 1).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium">{currentUser.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{currentUser.email}</p>
                </div>
              </div>
              <Form method="post" action="/logout">
                <button
                  type="submit"
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-muted-foreground hover:bg-muted"
                >
                  <LogOut size={14} />
                  Log out
                </button>
              </Form>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={onClose}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium"
              style={{ color: "#0f3d2e" }}
            >
              <LogIn size={14} />
              Log in to make changes
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}