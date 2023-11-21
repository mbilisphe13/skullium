import {Request} from "express"
import path from "path";
import { getViteConfig } from "./vite";

export function ziggy(req: Request) {
    return `
        <script type="text/javascript">
            const Ziggy = ${JSON.stringify(req.ziggy)};
            if (typeof window !== 'undefined' && typeof window.Ziggy !== 'undefined') {
                Object.assign(Ziggy.routes, window.Ziggy.routes);
            }
        </script>
    `
}

export async function vite() {
    const production = process.env.NODE_ENV === 'production';
    const viteConfig = await getViteConfig();
    const manifest = production
        ? await import(path.join(process.cwd(), viteConfig.build.outDir, 'manifest.json'))
        : {}
    const inputPath = viteConfig.build.rollupOptions.input.startsWith('.')
        ? viteConfig.build.rollupOptions.input.slice(1)
        : viteConfig.build.rollupOptions.input

    const inputKey = viteConfig.build.rollupOptions.input.startsWith('./')
        ? viteConfig.build.rollupOptions.input.slice(2)
        : viteConfig.build.rollupOptions.input

    return production
        ? `
        <link rel="stylesheet" href="/${manifest[inputPath].css}"/>
        <script type="module" src="/${manifest[inputPath].file}"></script>
        `
        : `
        <script type="module" src="/@vite/client"></script>
        <script type="module" src="${inputPath}"></script>
        `
}