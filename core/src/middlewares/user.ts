import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import { AuthModel } from "../core";

export function user(User: typeof AuthModel){
    return async function (req: Request, res: Response, next: NextFunction) {
        const isApiRequest = req.originalUrl.startsWith('/api')
    
        if (isApiRequest) {
            const bearerToken = req.headers['authorization'] || req.query.token
    
            if (bearerToken) {
                try {
                    if (typeof bearerToken === "string") {
                        const decodedToken = jwt.verify(
                            bearerToken.replace('Bearer ', ''),
                            process.env.SESSION_SECRET || 'secret'
                        ) as any
    
                        req.user = await User.findOneBy({id: decodedToken.userId}) || undefined
                    }
    
                } catch (error) {
                }
            }
        } else if (req.session && req.session.userId) {
            req.user = await User.findOneBy({id: req.session.userId}) || undefined
        }
    
        next()
    }
}