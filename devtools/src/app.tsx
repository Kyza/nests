import type { Component } from "solid-js";
import { Link, useRoutes, useLocation } from "solid-app-router";

import { routes } from "./routes";

const App: Component = () => {
	const location = useLocation();
	const Route = useRoutes(routes);

	return (
		<>
			<nav class="bg-[#292a2d] text-[#9AA0A6]">
				<ul class="flex items-center px-2 h-8">
					<li class="">
						<Link
							href="/"
							class={`p-2 no-underline duration-300 hover:(text-[#EAEAEA])${
								location.pathname === "/" ? " text-[#EAEAEA]" : ""
							}`}
						>
							Stores
						</Link>
					</li>
					<li class="">
						<Link
							href="/state"
							class={`p-2 no-underline duration-300 hover:(text-[#EAEAEA])${
								location.pathname === "/state" ? " text-[#EAEAEA]" : ""
							}`}
						>
							State
						</Link>
					</li>
					<li class="">
						<Link
							href="/about"
							class={`p-2 no-underline duration-300 hover:(text-[#EAEAEA])${
								location.pathname === "/about" ? " text-[#EAEAEA]" : ""
							}`}
						>
							About
						</Link>
					</li>
				</ul>
			</nav>

			<main>
				<Route />
			</main>
		</>
	);
};

export default App;
