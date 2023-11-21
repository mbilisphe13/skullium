import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import url from "url";
import { Unauthorized } from "../core";

type HttpVerb = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD"

export function signed(...methods: HttpVerb[]) {
    return function (req: Request, res: Response, next: NextFunction) {
        if (methods.length === 0 || methods.includes(req.method as any)) {
            const token = req.query.signature;
            if (!token) {
                return res.status(401).json({message: 'Unauthorized'});
            }

            jwt.verify(token as string, process.env.SIGNITURE_KEY || 'sign-key', (err: any, decoded: any) => {
                if (err) {
                    return res.inertia as any
                    ?  next(new Unauthorized('Invalid signature'))
                    : res.status(401).json({message: 'Invalid signature'});
                }

                const {query, pathname} = url.parse(req.originalUrl, true);

                delete query.signature;

                const fullUrl = url.format({pathname: req.path, query: query});

                if (!('/' + decoded.route === fullUrl)) {
                    return res.inertia as any
                    ?  next(new Unauthorized('Invalid signature'))
                    : res.status(401).json({message: 'Invalid signature'});
                }
            });
        }
        next()
    }
}
