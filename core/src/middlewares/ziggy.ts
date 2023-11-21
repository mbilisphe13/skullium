import {NextFunction, Request, Response} from "express";

export function ziggy(routes: any) {
    return (req: Request, res: Response, next: NextFunction) => {
        req.ziggy = {
            url: process.env.APP_HOST || 'http://localhost:3000',
            port: parseInt(process.env.APP_PORT || '3000'),
            defaults: {},
            routes,
        }
        next()
    }
}