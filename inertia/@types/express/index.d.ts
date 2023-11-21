declare global {
    declare module 'express-serve-static-core' {
        interface Request {
            inertiaFlash: Record<string, any>;
            ziggy: any
        }

        interface Response {
            inertia: (component: string, props?: any) => Promise<void>
            success: (message: string) => void
            error: (message: string) => void
            errors: (errors: Record<string, string[]>) => void
            message: (message: string) => void
            back: () => void
            divert: (name: string, parameters?: Record<string, any>) => void
        }
    }
}