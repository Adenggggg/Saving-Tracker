export const TOTAL_WEEKS = 24;

export const AVATAR_COLORS = [
  "#0f3d2e",
  "#c9a227",
  "#3f8f6f",
  "#6b8f3f",
  "#8f6f3f",
  "#3f6b8f",
  "#8f3f5f",
];

export const SAVINGS_START_DATE = "2026-08-02";

const PHT_OFFSET_MS = 8 * 60 * 60 * 1000;

export function peso(n: number) {
  return "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function currentWeekStart() {
  const nowUtc = new Date();
  const pht = new Date(nowUtc.getTime() + PHT_OFFSET_MS);

  const day = pht.getUTCDay(); // 0 = Sunday
  const diff = pht.getUTCDate() - day;
  const sunday = new Date(Date.UTC(pht.getUTCFullYear(), pht.getUTCMonth(), diff));

  return sunday.toISOString().slice(0, 10);
}

export function daysUntilChristmas() {
  const now = new Date();
  const year = now.getMonth() === 11 && now.getDate() > 25 ? now.getFullYear() + 1 : now.getFullYear();
  const christmas = new Date(year, 11, 25);
  return Math.ceil((christmas.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function weekNumberSinceStart(startDate: string, weekStart: string) {
  const start = new Date(startDate);
  const current = new Date(weekStart);
  const weeks = Math.round((current.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;
  return Math.min(Math.max(weeks, 1), TOTAL_WEEKS);
}

export function formatLongDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShortDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function addDaysToDateStr(dateStr: string, days: number) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function listWeeksSinceStart(upToWeekStart: string) {
  const start = new Date(SAVINGS_START_DATE);
  const upTo = new Date(upToWeekStart);

  const weeks: { weekNum: number; weekStart: string }[] = [];
  let cursor = new Date(start);
  let weekNum = 1;

  while (cursor.getTime() <= upTo.getTime() && weekNum <= TOTAL_WEEKS) {
    weeks.push({ weekNum, weekStart: cursor.toISOString().slice(0, 10) });
    cursor.setDate(cursor.getDate() + 7);
    weekNum++;
  }

  return weeks;
}