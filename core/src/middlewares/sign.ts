import {NextFunction, Request, Response} from "express";
import url from "url";
import jwt from "jsonwebtoken";

export function sign(req: Request, res: Response, next: NextFunction) {
    req.sign = (route: string, params: Record<string, any>, expiresIn?: string | number | undefined) => {
        const payload = {route: url.format({pathname: route, query: params})}

        const token = jwt.sign(payload,
            process.env.SIGNITURE_KEY || 'sign-key',
            {expiresIn: expiresIn || '1h'})
        return url.format({
            pathname: route,
            query: {...params, signature: token},
        })
    }

    next()
}