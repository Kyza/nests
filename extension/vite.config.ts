import { defineConfig } from "vite";

export default defineConfig({
	build: {
		outDir: "../dist/extension/",
		target: "ESNext",
		polyfillDynamicImport: false,
		lib: {
			entry: "src/content.ts",
			formats: ["cjs"],
			fileName: () => "content.js",
		},
	},
	base: "./",
});
