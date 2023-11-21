import {NextFunction, Request, Response} from "express";

type HttpVerb = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD"

export function auth(...methods: HttpVerb[]) {
    return function (req: Request, res: Response, next: NextFunction) {
        if (methods.length === 0 || methods.includes(req.method as any)) {
            if (!req.user) {
                return res.inertia as any
                ?  res.divert('login', {intended: req.originalUrl})
                : res.status(401).json({message: 'Unauthorized'})
            }
        }

        next();
    }
}