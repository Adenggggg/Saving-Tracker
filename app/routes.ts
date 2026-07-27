import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/dashboard.tsx"),
  route("api/contribute", "routes/api.contribute.ts"),
  route("api/push/subscribe", "routes/api.push-subscribe.ts"),
  route("api/push/notify", "routes/api.push-notify.ts"),
] satisfies RouteConfig;
