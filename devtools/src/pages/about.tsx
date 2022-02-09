import { Component, createEffect, For, Suspense } from "solid-js";
import { Link, useData } from "solid-app-router";

import pkg from "../../package.json";

export default function About() {
	return (
		<section class="p-4 pt-2">
			<h1 class="text-2xl font-bold">About</h1>

			<p>Nests DevTools.</p>

			<h1 class="text-2xl font-bold">Dependencies</h1>

			<For each={Object.entries(pkg.dependencies)}>
				{([name, version]) => (
					<p>
						<Link
							href={`https://www.npmjs.com/package/${name}`}
							target="_blank"
						>
							{name}
						</Link>{" "}
						v{version.slice(1)}
					</p>
				)}
			</For>
		</section>
	);
}
