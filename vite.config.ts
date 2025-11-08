import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    root: ".",
    build: {
        lib: {
            entry: "src/index.ts",
            name: "ReactMachine",
            fileName: (format) => `index.${format}.js`,
        },
        rollupOptions: {
            external: ["react", "react-dom"],
        },
    },
});
