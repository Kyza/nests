#!/usr/bin/env zx

const { fs } = require("zx");

// Clean last build.
await fs.emptyDir("lib");

// Build all.
await Promise.all([
	$`npx tsc --project tsconfig.esm.json`,
	$`npx tsc --project tsconfig.mjs.json`,
	$`npx tsc --project tsconfig.cjs.json`,
	$`npx tsc --project tsconfig.types.json`,
]);

// Rename the files to .mjs.
cd("lib/mjs");
await $`npx renamer --find ".js" --replace ".mjs" "**"`;
cd("../..");

// Copy over all the types.
// Copy over the README.md, LICENSE, and package.json.
await Promise.all([
	fs.copySync("lib/types", "lib/esm"),
	fs.copySync("lib/types", "lib/mjs"),
	fs.copySync("lib/types", "lib/cjs"),
	Promise.all([
		fs.createFile("lib/package.json"),
		fs.copyFile("package.json", "lib/package.json"),
	]),
	Promise.all([
		fs.createFile("lib/LICENSE"),
		fs.copyFile("LICENSE", "lib/LICENSE"),
	]),
	Promise.all([
		fs.createFile("lib/README.md"),
		fs.copyFile("README.md", "lib/README.md"),
	]),
]);
