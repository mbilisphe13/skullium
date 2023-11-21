import {NextFunction, Request, Response} from "express";
import { SkullError } from "../core";


export async function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
    if (err instanceof SkullError) {
        return (res.inertia as any)
            ? res.render('error', {
                message: err.message,
                status: err.status,
                name: err.name
            })
            : res.status(err.status).json({error: err.message});

    } else {
        return (res.inertia as any)
            ? res.render('error', {
                message: 'We are working to have it resolved.',
                status: 500,
                name: 'Server error'
            })
            : res.status(500).json({error: err});
    }
}