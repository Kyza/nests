#!/usr/bin/env zx

import "zx/globals";

// Clean last build.
await fs.emptyDir("lib");

// Build all.
await Promise.all([
	$`npx tsc --project tsconfig.json`,
	$`npx tsc --project tsconfig.cjs.json`,
	$`npx tsc --project tsconfig.types.json`,
]);

// Copy the ESM build to the ./lib/esm directory.
await fs.copy("lib/temp", "lib/esm", { recursive: true });

// Rename the files to .mjs.
cd("lib/temp");
await $`npx renamer --find ".js" --replace ".mjs" "**"`;
cd("../..");

// Copy the ESM build to the ./lib/esm directory again.
await fs.copy("lib/temp", "lib/esm", { recursive: true });
// Delete the temp directory.
await fs.rmdir("lib/temp", { recursive: true });

// Copy over the README.md, LICENSE, and package.json.
await fs.createFile("lib/package.json");
await fs.copyFile("package.json", "lib/package.json");
await fs.createFile("lib/LICENSE");
await fs.copyFile("LICENSE", "lib/LICENSE");
await fs.createFile("lib/README.md");
await fs.copyFile("README.md", "lib/README.md");
