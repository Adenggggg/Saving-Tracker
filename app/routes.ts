import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/dashboard.tsx"),
  route("members", "routes/members.tsx"),
  route("history", "routes/history.tsx"),
  route("activity-log", "routes/activity-log.tsx"),
  route("settings", "routes/settings.tsx"),
  route("login", "routes/login.tsx"),
  route("auth/verify", "routes/auth.verify.ts"),
  route("logout", "routes/logout.tsx"),
  route("api/contribute", "routes/api.contribute.ts"),
  route("api/catch-up", "routes/api.catch-up.ts"),
  route("api/undo-payment", "routes/api.undo-payment.ts"),
  route("api/remind-member", "routes/api.remind-member.ts"),
  route("api/remind-all", "routes/api.remind-all.ts"),
  route("api/update-fund", "routes/api.update-fund.ts"),
  route("api/update-budget-categories", "routes/api.update-budget-categories.ts"),
  route("api/reset-fund", "routes/api.reset-fund.ts"),
  route("api/push-subscribe", "routes/api.push-subscribe.ts"),
] satisfies RouteConfig;