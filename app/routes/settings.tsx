import { useState } from "react";
import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { Menu, Lock } from "lucide-react";
import { loadSettingsData } from "~/lib/settings-loader.server";
import { getCurrentUser } from "~/lib/auth.server";
import { Sidebar } from "~/components/dashboard/Sidebar";
import { SettingsHeader } from "~/components/settings/SettingsHeader";
import { FundSettingsPanel } from "~/components/settings/FundSettingsPanel";
import { DangerZone } from "~/components/settings/DangerZone";
import { NoGroupYet } from "~/components/dashboard/NoGroupYet";

export async function loader({ request }: LoaderFunctionArgs) {
  const [data, currentUser] = await Promise.all([loadSettingsData(), getCurrentUser(request)]);
  return { ...data, currentUser };
}

export default function SettingsPage() {
  const { group, categories, currentUser } = useLoaderData<typeof loader>();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!group) return <NoGroupYet />;

  const isAuthenticated = !!currentUser;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#f7f6f2" }}>
      <Sidebar title={group.name} open={menuOpen} onClose={() => setMenuOpen(false)} currentUser={currentUser} />

      <main className="relative h-screen flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        <div className="relative z-10">
          <div className="mb-1 flex items-center gap-3 md:hidden">
            <button className="rounded-md p-1.5 hover:bg-muted" onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <Menu size={20} />
            </button>
            <p className="text-xs font-semibold tracking-[0.15em]" style={{ color: "#b23b3b" }}>
              MANAGEMENT CONSOLE
            </p>
          </div>

          <div className="hidden md:block">
            <SettingsHeader />
          </div>
          <div className="md:hidden">
            <SettingsHeader hideLabel />
          </div>

          {!isAuthenticated && (
            <p className="mb-4 flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs" style={{ background: "#fbeaea", color: "#b23b3b" }}>
              <Lock size={12} />
              You're viewing in read-only mode. Log in with your registered email to make changes.
            </p>
          )}

          <div className="max-w-5xl space-y-4">
            <FundSettingsPanel
              groupId={group.id}
              name={group.name}
              weeklyAmount={group.weeklyAmount}
              goalAmount={group.goalAmount ?? 0}
              categories={categories}
              isAuthenticated={isAuthenticated}
            />

            <DangerZone groupId={group.id} groupName={group.name} isAuthenticated={isAuthenticated} />
          </div>
        </div>
      </main>
    </div>
  );
}