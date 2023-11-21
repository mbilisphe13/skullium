declare global {
    declare module 'express-serve-static-core' {
        interface Request {
            user: any
            session: Partial<Session.SessionData> & {
                userId: number;
                csrfToken: string;
            },
            sign: (route: string, params: Record<string, any>, expiresIn?: string | number | undefined) => string,
            ziggy: any,
            routeNames: any
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