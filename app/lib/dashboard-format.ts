export const TOTAL_WEEKS = 24;

export const SAVINGS_START_DATE = "2026-08-02";

export const AVATAR_COLORS = [
  "#0f3d2e",
  "#c9a227",
  "#3f8f6f",
  "#6b8f3f",
  "#8f6f3f",
  "#3f6b8f",
  "#8f3f5f",
];

export function peso(n: number) {
  return "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function currentWeekStart() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().slice(0, 10);
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