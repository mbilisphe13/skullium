declare global {
    declare module 'express-serve-static-core' {
        interface Request {
            user?: User,
            inertiaFlash: Record<string, any>;
            ziggy: any,
            skull : {
                validated: Record<string, any>,
                [key: string]: Model | null;
            },
            session: Partial<Session.SessionData> & {
                userId: number;
                csrfToken: string;
                inertiaFlash: Record<string, any>;
                errors: Record<string, string[]>;
            },
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