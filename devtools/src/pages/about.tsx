import { Component, createEffect, For, Suspense } from "solid-js";
import { Link, useData } from "solid-app-router";

import pkg from "../../package.json";

export default function AboutPanel() {
	return (
		<section class="p-4 pt-2">
			<h1 class="text-2xl font-bold">About</h1>

			<p>
				<Link
					class="underline underline-[#cfd0d0]"
					href="https://github.com/Kyza/nests/tree/devtools"
					target="_blank"
				>
					Nests DevTools
				</Link>{" "}
				is a state inspector for the{" "}
				<Link
					class="underline underline-[#cfd0d0]"
					href="https://github.com/Kyza/nests/"
					target="_blank"
				>
					Nests
				</Link>{" "}
				state storage library as well as anything else you want to connect.
			</p>

			<h1 class="text-2xl font-bold">Dependencies</h1>

			<For each={Object.entries(pkg.dependencies)}>
				{([name, version]) => (
					<p>
						<Link
							class="underline underline-[#cfd0d0]"
							href={`https://www.npmjs.com/package/${name}`}
							target="_blank"
						>
							{name}
						</Link>{" "}
						<Link
							class="underline underline-[#cfd0d0]"
							href={`https://www.npmjs.com/package/${name}/v/${version.slice(
								1
							)}`}
							target="_blank"
						>
							v{version.slice(1)}
						</Link>
					</p>
				)}
			</For>
		</section>
	);
}
