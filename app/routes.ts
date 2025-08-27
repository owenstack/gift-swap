import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("/api/set-theme", "routes/api/set-theme.ts"),
] satisfies RouteConfig;
