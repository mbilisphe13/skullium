import {Controller} from "../core/controller";
import path from "path";
import fs from "fs-extra";

export async function getControllers(directoryPath: string): Promise<[string, Controller][]> {
    const routesPath = path.join(process.cwd(), process.env.ROUTES_FOLDER||'src/app/controllers', directoryPath)
    const controllers: [string, Controller][] = []

    async function importController(filePath: string): Promise<Controller | null> {
        try {
            const modulePath = `${filePath.replace(/\.ts$/, '')}`
            const module = await import(modulePath)
            return (new module.default()) as Controller
        } catch (error) {
            console.log(`Error loadind route: ${filePath}`)
            console.log({error})
            return null
        }
    }

    function createUrlPath(file: string, basePath: string) {
        let urlPath = file === 'index.ts' ? basePath : basePath + '/' + path.basename(file, '.ts')
        return urlPath.replace(/\([^)]*\)/g, "").replace(/\[(\w+)]/g, ':$1').replace(/\/+/g, "/")
    }

    async function loadRoutes(dir: string, basePath: string = '') {
        const files = await fs.readdir(dir)

        for (const file of files) {
            const filePath = path.join(dir, file)
            const urlPath = createUrlPath(file, basePath)

            if ((await fs.stat(filePath)).isDirectory()) {
                await loadRoutes(filePath, urlPath)
            } else if (file.endsWith('.ts')) {
                const controller = await importController(filePath)
                controller && controllers.push([urlPath.replace(/\[(\w+)]/g, ":$1"), controller])
            }
        }
    }

    await loadRoutes(routesPath)

    return controllers
}