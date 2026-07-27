const NAV = [
  { icon: "ti-layout-dashboard", label: "Dashboard" },
  { icon: "ti-users", label: "Members" },
  { icon: "ti-history", label: "History" },
  { icon: "ti-settings", label: "Settings" },
];

export function Sidebar({ title }: { title: string }) {
  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-border bg-white p-4">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md" style={{ background: "#0f3d2e" }}>
          <i className="ti ti-gift text-base text-white" aria-hidden="true" />
        </div>
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <nav className="space-y-1">
        {NAV.map((item, i) => (
          <div
            key={item.label}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm"
            style={
              i === 0
                ? { background: "#e7f0ea", color: "#0f3d2e", fontWeight: 500 }
                : { color: "#8a8a8a" }
            }
          >
            <i className={`ti ${item.icon} text-base`} aria-hidden="true" />
            {item.label}
          </div>
        ))}
      </nav>
    </aside>
  );
}
