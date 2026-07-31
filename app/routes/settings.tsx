import { useState } from "react";
import { useLoaderData } from "react-router";
import { Menu } from "lucide-react";
import { loadSettingsData } from "~/lib/settings-loader.server";
import { Sidebar } from "~/components/dashboard/Sidebar";
import { SettingsHeader } from "~/components/settings/SettingsHeader";
import { FundConfiguration } from "~/components/settings/FundConfiguration";
import { TeamSection } from "~/components/settings/TeamSection";
import { BudgetBreakdownSettings } from "~/components/settings/BudgetBreakdownSettings";
import { DangerZone } from "~/components/settings/DangerZone";
import { NoGroupYet } from "~/components/dashboard/NoGroupYet";

export async function loader() {
  return loadSettingsData();
}

export default function SettingsPage() {
  const { group, members, categories } = useLoaderData<typeof loader>();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!group) return <NoGroupYet />;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#f7f6f2" }}>
      <Sidebar title={group.name} open={menuOpen} onClose={() => setMenuOpen(false)} />

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

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <FundConfiguration
              groupId={group.id}
              name={group.name}
              weeklyAmount={group.weeklyAmount}
              goalAmount={group.goalAmount ?? 0}
            />
            <TeamSection members={members} />
          </div>

          <div className="mt-4">
            <BudgetBreakdownSettings categories={categories} />
          </div>

          <div className="mt-4">
            <DangerZone groupId={group.id} groupName={group.name} />
          </div>
        </div>
      </main>
    </div>
  );
}