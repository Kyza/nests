import { lazy } from "solid-js";
import type { RouteDefinition } from "solid-app-router";

import SelectPanel from "./pages/index";
import InspectPage from "./pages/inspect";
import AboutPanel from "./pages/about";
import NotFound from "./errors/404";

export const routes: RouteDefinition[] = [
	{
		path: "/",
		component: SelectPanel,
	},
	{
		path: "/inspect",
		component: InspectPage,
	},
	{
		path: "/about",
		component: AboutPanel,
	},
	{
		path: "**",
		component: NotFound,
	},
];
