import { useEffect, useState } from "react";
import { useLoaderData, useFetcher } from "react-router";
import { eq, and } from "drizzle-orm";
import { db } from "../../db/client";
import { groups, groupMembers, users, contributions } from "../../db/schema";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";

function peso(n: number) {
  return "₱" + n.toLocaleString("en-PH");
}

function currentWeekStart() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().slice(0, 10);
}

export async function loader() {
  const group = (await db.select().from(groups).limit(1))[0];
  if (!group) {
    return { group: null, members: [], paidUserIds: [], weekStart: currentWeekStart(), totalSaved: 0 };
  }

  const members = await db
    .select({ id: users.id, name: users.name, email: users.email })
    .from(groupMembers)
    .innerJoin(users, eq(users.id, groupMembers.userId))
    .where(eq(groupMembers.groupId, group.id));

  const weekStart = currentWeekStart();

  const paidRows = await db
    .select()
    .from(contributions)
    .where(and(eq(contributions.groupId, group.id), eq(contributions.weekStart, weekStart)));

  const allContributions = await db
    .select()
    .from(contributions)
    .where(eq(contributions.groupId, group.id));

  const totalSaved = allContributions.reduce((sum, c) => sum + c.amount, 0);

  return {
    group,
    members,
    paidUserIds: paidRows.map((r) => r.userId),
    weekStart,
    totalSaved,
  };
}

const NAV = [
  { icon: "ti-layout-dashboard", label: "Dashboard" },
  { icon: "ti-users", label: "Members" },
  { icon: "ti-history", label: "History" },
  { icon: "ti-settings", label: "Settings" },
];

export default function Dashboard() {
  const { group, members, paidUserIds, weekStart, totalSaved } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    } else {
      setPermission("unsupported");
    }
  }, []);

  async function enablePush() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
    const reg = await navigator.serviceWorker.register("/sw.js");
    const perm = await Notification.requestPermission();
    setPermission(perm);
    if (perm !== "granted") return;

    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(window.ENV_VAPID_PUBLIC_KEY),
    });

    await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sub),
    });
  }

  if (!group) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="text-xl font-medium">No group yet</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Insert a row into the `groups` and `users` tables (see README) to get started.
        </p>
      </main>
    );
  }

  const goalPct = group.goalAmount ? Math.min(100, Math.round((totalSaved / group.goalAmount) * 100)) : 0;
  const remaining = group.goalAmount ? Math.max(0, group.goalAmount - totalSaved) : 0;

  const stats = [
    { label: "Weekly goal", value: peso(group.weeklyAmount), icon: "ti-target-arrow" },
    { label: "Paid this week", value: `${paidUserIds.length}/${members.length}`, icon: "ti-checks" },
    { label: "Total saved", value: peso(totalSaved), icon: "ti-pig-money" },
    { label: "Remaining", value: peso(remaining), icon: "ti-flag" },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-56 shrink-0 border-r border-border bg-[var(--surface-1)] p-4 md:block">
        <div className="mb-8 flex items-center gap-2 px-2">
          <i className="ti ti-gift text-lg" aria-hidden="true" />
          <span className="text-sm font-medium">Party Fund</span>
        </div>
        <nav className="space-y-1">
          {NAV.map((item, i) => (
            <div
              key={item.label}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                i === 0 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <i className={`ti ${item.icon} text-base`} aria-hidden="true" />
              {item.label}
            </div>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-8 space-y-6 max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-medium">{group.name}</h1>
            <p className="text-sm text-muted-foreground">Week of {weekStart}</p>
          </div>
          <Button onClick={enablePush} variant="secondary" disabled={permission === "granted" || permission === "unsupported"}>
            <i className="ti ti-bell mr-2 text-base" aria-hidden="true" />
            {permission === "granted" ? "Reminders on · Sundays" : "Enable Sunday reminders"}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label} className="p-0">
              <CardContent className="p-4">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                  <i className={`ti ${s.icon} text-lg`} aria-hidden="true" />
                </div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="mt-1 text-xl font-medium">{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {group.goalAmount ? (
          <Card>
            <CardContent className="space-y-3 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Christmas party goal</p>
                <p className="text-sm text-muted-foreground">
                  {peso(totalSaved)} / {peso(group.goalAmount)} · {goalPct}%
                </p>
              </div>
              <Progress value={goalPct} />
            </CardContent>
          </Card>
        ) : null}

        <Card>
          <CardContent className="p-0">
            <div className="border-b border-border px-5 py-3">
              <p className="text-sm font-medium">Members</p>
            </div>
            <div>
              {members.map((m) => {
                const paid = paidUserIds.includes(m.id);
                return (
                  <div
                    key={m.id}
                    className="flex items-center justify-between border-b border-border px-5 py-3 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                        {m.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-sm">{m.name}</span>
                    </div>
                    {paid ? (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <i className="ti ti-circle-check text-sm" aria-hidden="true" />
                        Paid
                      </span>
                    ) : (
                      <fetcher.Form method="post" action="/api/contribute">
                        <input type="hidden" name="userId" value={m.id} />
                        <input type="hidden" name="groupId" value={group.id} />
                        <input type="hidden" name="amount" value={group.weeklyAmount} />
                        <input type="hidden" name="weekStart" value={weekStart} />
                        <Button type="submit" size="sm" variant="outline">
                          Mark paid
                        </Button>
                      </fetcher.Form>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

declare global {
  interface Window {
    ENV_VAPID_PUBLIC_KEY: string;
  }
}
