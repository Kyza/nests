#!/usr/bin/env zx

const { fs } = require("zx");

// Clean last build.
await fs.emptyDir("lib");

// Build all.
await Promise.all([
	$`npx tsc --project tsconfig.cjs.json`,
	$`npx tsc --project tsconfig.esm.json`,
	$`npx tsc --project tsconfig.mjs.json`,
	$`npx tsc --project tsconfig.types.json`,
]);

// Rename the files to .mjs.
cd("lib/mjs");
await $`npx renamer --find ".js" --replace ".mjs" "**"`;
cd("../..");

// Copy over all the types.
// Copy over the README.md, LICENSE, and package.json.
await Promise.all([
	fs.copySync("lib/types", "lib/cjs"),
	fs.copySync("lib/types", "lib/esm"),
	fs.copySync("lib/types", "lib/mjs"),
	fs.copyFile("package.json", "lib/package.json"),
	fs.copyFile("LICENSE", "lib/LICENSE"),
	fs.copyFile("README.md", "lib/README.md"),
]);
