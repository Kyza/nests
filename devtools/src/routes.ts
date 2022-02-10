import { lazy } from "solid-js";
import type { RouteDefinition } from "solid-app-router";

import Dashboard from "./pages/index";

export const routes: RouteDefinition[] = [
	{
		path: "/",
		component: lazy(() => import("./pages/index")),
	},
	{
		path: "/inspect",
		component: lazy(() => import("./pages/inspect")),
	},
	{
		path: "/about",
		component: lazy(() => import("./pages/about")),
	},
	{
		path: "**",
		component: lazy(() => import("./errors/404")),
	},
];
