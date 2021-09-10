#!/usr/bin/env zx

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

// Copy the ESM build to the ./lib/esm directory again.
// Copy over the README.md, LICENSE, and package.json.
await fs.createFile("lib/package.json");
await fs.copyFile("package.json", "lib/package.json");
await fs.createFile("lib/LICENSE");
await fs.copyFile("LICENSE", "lib/LICENSE");
await fs.createFile("lib/README.md");
await fs.copyFile("README.md", "lib/README.md");
