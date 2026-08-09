import { useMemo, useState } from "react";
import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { loadMembersData } from "~/lib/members-loader.server";
import { getCurrentUser } from "~/lib/auth.server";
import { Sidebar } from "~/components/dashboard/Sidebar";
import { RegistryOverview } from "~/components/members/RegistryOverview";
import { MemberSearch } from "~/components/members/MemberSearch";
import { MembersTable } from "~/components/members/MembersTable";
import { NoGroupYet } from "~/components/dashboard/NoGroupYet";
import { PushOptIn } from "~/components/PushOptIn";
import { Menu } from "lucide-react";

export async function loader({ request }: LoaderFunctionArgs) {
  const [data, currentUser] = await Promise.all([loadMembersData(), getCurrentUser(request)]);
  return { ...data, currentUser };
}

export default function MembersPage() {
  const { group, members, currentUser } = useLoaderData<typeof loader>();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  if (!group) return <NoGroupYet />;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)
    );
  }, [members, query]);

  const paidThisWeekCount = members.filter((m) => m.paidThisWeek).length;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#f7f6f2" }}>
      <Sidebar title={group.name} open={menuOpen} onClose={() => setMenuOpen(false)} currentUser={currentUser} />

      <main className="h-screen flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        <div className="mb-4 flex items-center gap-3">
          <button className="rounded-md p-1.5 hover:bg-muted md:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu size={20} />
          </button>
          <p className="text-xs font-semibold tracking-[0.15em]" style={{ color: "#b23b3b" }}>
            REGISTRY OVERVIEW
          </p>
        </div>

        {currentUser && <PushOptIn />}

        <RegistryOverview totalMembers={members.length} paidThisWeekCount={paidThisWeekCount} />

        <MemberSearch value={query} onChange={setQuery} />

        <MembersTable
          members={filtered}
          groupId={group.id}
          pendingCount={members.length - paidThisWeekCount}
          isAuthenticated={!!currentUser}
        />
      </main>
    </div>
  );
}