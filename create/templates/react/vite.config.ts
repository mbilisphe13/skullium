import { defineConfig } from "vite";
import * as path from "path";

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src/client/js'),
        },
    },
    build: {
        manifest: true,
        rollupOptions: {
            input: './src/client/js/app.tsx',
        },
        outDir: './src/client/public',
    },
});
