#!/usr/bin/env zx

const fs = require("fs-extra");
const path = require("path");

async function* walk(dir) {
	for await (const d of await fs.promises.opendir(dir)) {
		const entry = path.join(dir, d.name);
		if (d.isDirectory()) yield* walk(entry);
		else if (d.isFile()) yield entry;
	}
}

// Clean last build.
await fs.emptyDir("dist");

// Build all.
await Promise.all([
	$`npx tsc --project tsconfig.json`,
	$`npx tsc --project tsconfig.cjs.json`,
	$`npx tsc --project tsconfig.types.json`,
]);

await Promise.all([
	fs.copy("package.json", "dist/package.json"),
	fs.copy("README.md", "dist/README.md"),
	fs.copy("LICENSE", "dist/LICENSE"),
	fs.copy("dist/types", "dist"),
	fs.copy("dist/types", "dist/esm"),
]);
fs.rm("dist/types", {
	recursive: true,
});

// for await (const file of walk("./esm")) {
// 	if (file.endsWith(".js")) {
// 	}
// }

// Copy over all the types.
// await Promise.all([
// 	fs.copySync("package.json", "lib/package.json"),
// 	fs.copySync("README.md", "lib/README.md"),
// 	fs.copySync("LICENSE", "lib/LICENSE"),
// ]);
