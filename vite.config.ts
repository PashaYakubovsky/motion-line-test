import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";

import path from "path";
const __dirname = path.resolve();

// https://vitejs.dev/config/
export default defineConfig({
    // added alias for public folder
    resolve: {
        alias: [
            {
                find: "@/gsap",
                replacement: path.resolve(__dirname, "./libs/gsap-business/esm"),
            },
        ],
    },
    plugins: [react(), glsl()],
});
