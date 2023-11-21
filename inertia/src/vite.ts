import express, {Express, RequestHandler} from "express"
import fs from "fs"
import http from "http"
import https from "https"
import path from "path"
import pc from "picocolors"

interface ViteConfig {
    root: string
    base: string
    build: {
        outDir: string,
        rollupOptions: {
            input: string
        }
    }
}

const state = {
    viteConfig: undefined as ViteConfig | undefined,
}

const clearState = () => {
    state.viteConfig = undefined
}

const info = (msg: string) => {
    const timestamp = new Date().toLocaleString("en-US").split(",")[1].trim()
    console.log(
        `${pc.dim(timestamp)} ${pc.bold(pc.cyan("[vite]"))} ${pc.green(msg)}`
    )
}

const isStaticFilePath = (path: string) => {
    return path.match(/(\.\w+$)|@vite|@id|@react-refresh/)
}

const getDefaultViteConfig = (): ViteConfig => {
    return {
        root: process.cwd(),
        base: "/",
        build: {
            outDir: "dist",
            rollupOptions: {
                input: "src/main.tsx"
            },
        }
    }
}

const getViteConfigPath = () => {
    if (fs.existsSync("vite.config.js")) return "vite.config.js"
    else if (fs.existsSync("vite.config.ts")) return "vite.config.ts"
    throw new Error("Unable to locate Vite config")
}

const resolveConfig = async (): Promise<ViteConfig> => {
    try {
        const {resolveConfig} = await import("vite")
        try {
            const config = await resolveConfig({}, "build")
            info(`Using ${pc.yellow("Vite")} to resolve the ${pc.yellow("config file")}`)
            return config as ViteConfig
        } catch (e) {
            console.error(e)
            info(pc.red(`Unable to use ${pc.yellow("Vite")}, running in ${pc.yellow("viteless")} mode`))
        }
    } catch (e) {
        1
    }

    try {
        const config = fs.readFileSync(getViteConfigPath(), "utf8")

        const root = config.match(/"?root"?\s*:\s*"([^"]+)"/)?.[1]
        const base = config.match(/"?base"?\s*:\s*"([^"]+)"/)?.[1]
        const outDir = config.match(/"?outDir"?\s*:\s*"([^"]+)"/)?.[1]
        const input = config.match(/"?input"?\s*:\s*"([^"]+)"/)?.[1]

        const defaultConfig = getDefaultViteConfig()

        return {
            root: root ?? defaultConfig.root,
            base: base ?? defaultConfig.base,
            build: {
                outDir: outDir ?? defaultConfig.build.outDir,
                rollupOptions: {input: input ?? defaultConfig.build.rollupOptions.input}
            },
        }
    } catch (e) {
        info(
            pc.red(`Unable to locate ${pc.yellow("vite.config.*s file")}, using default options`)
        )

        return getDefaultViteConfig()
    }
}

export const getViteConfig = async (): Promise<ViteConfig> => {
    if (!state.viteConfig) {
        state.viteConfig = await resolveConfig()
    }

    return state.viteConfig
}

const serveStatic = async (): Promise<RequestHandler> => {
    const distPath = path.resolve((await getViteConfig()).root, (await getViteConfig()).build.outDir)

    if (!fs.existsSync(distPath)) {
        info(`${pc.red(`Static files at ${pc.gray(distPath)} not found!`)}`)
        info(`${pc.yellow(`Did you forget to run ${pc.bold(pc.green("vite build"))} command?`)}`)
    } else {
        info(`${pc.green(`Serving static files from ${pc.gray(distPath)}`)}`)
    }

    return express.static(distPath, {index: false})
}

const injectStatic = async (app: Express, middleware: RequestHandler) => {
    const config = await getViteConfig()
    app.use(config.base, middleware)

    app.get("/*", async (req, res, next) => {
        return (isStaticFilePath(req.path))
            ? next()
            : next(new Error("The requested resource was not found."))
    })
}

const startServer = async (server: http.Server | https.Server) => {
    const {createServer, mergeConfig} = await import("vite")

    const config = await getViteConfig()
    const isUsingViteResolvedConfig = Object.entries(config).length > 3

    const vite = await createServer(
        mergeConfig(isUsingViteResolvedConfig ? {} : config, {
            clearScreen: false,
            appType: "custom",
            server: {middlewareMode: true},
        })
    )

    server.on("close", () => vite.close())

    return vite
}

const bind = async (app: Express, server: http.Server | https.Server, callback?: (app:Express) => void) => {
    info(`Running in ${pc.yellow(process.env.NODE_ENV)} mode`)

    clearState()

    if (process.env.NODE_ENV === "development") {
        const vite = await startServer(server)
        await injectStatic(app, vite.middlewares)
    } else {
        await injectStatic(app, await serveStatic())
    }
    callback?.(app)
}

export const listen = (app: Express, port: number, callback?: (app: Express) => void) => {
    const server = app.listen(port, () => bind(app, server, callback))
    return server
}
