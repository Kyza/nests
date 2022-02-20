import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import WindiCSS from "vite-plugin-windicss";

export default defineConfig({
	plugins: [solidPlugin(), WindiCSS()],
	build: {
		outDir: "../../../dist/extension/ui",
		target: "esnext",
		polyfillDynamicImport: false,
	},
	base: "./",
});
