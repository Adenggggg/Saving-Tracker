import type { MemberRow as MemberRowType } from "~/lib/members-loader.server";
import { MemberRow } from "~/components/members/MemberRow";

export function MembersTable({ members }: { members: MemberRowType[] }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="border-b border-border text-xs font-medium tracking-wide text-muted-foreground">
              <th className="pb-3 pr-4 font-medium">MEMBER IDENTITY</th>
              <th className="pb-3 pr-4 font-medium">STATUS</th>
              <th className="pb-3 pr-4 font-medium">TOTAL CONTRIBUTED</th>
              <th className="pb-3 pr-4 font-medium">LAST ACTIVITY</th>
              <th className="pb-3 font-medium">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, i) => (
              <MemberRow key={member.id} member={member} index={i} />
            ))}
          </tbody>
        </table>
      </div>

      {members.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">No members match your search.</p>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        Showing {members.length} of {members.length} members
      </p>
    </div>
  );
}