#!/usr/bin/env zx

const { fs } = require("zx");

// Clean last build.
await fs.emptyDir("lib");

// Build all.
await Promise.all([
	$`npx tsc --project tsconfig.cjs.json`,
	$`npx tsc --project tsconfig.json`,
	$`npx tsc --project tsconfig.mjs.json`,
	$`npx tsc --project tsconfig.types.json`,
]);

// Rename the files to .mjs.
cd("lib/mjs");
await $`npx renamer --find ".js" --replace ".mjs" "**"`;
cd("../..");

// Copy over all the types.
await Promise.all([
	fs.copySync("lib/types", "lib/cjs"),
	fs.copySync("lib/types", "lib/esm"),
	fs.copySync("lib/types", "lib/mjs"),
	fs.copySync("package.json", "lib/package.json"),
	fs.copySync("README.md", "lib/README.md"),
	fs.copySync("LICENSE", "lib/LICENSE"),
]);
