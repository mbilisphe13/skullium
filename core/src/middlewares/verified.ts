import {NextFunction, Request, Response} from "express";

type HttpVerb = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD"

export function verified(...methods: HttpVerb[]) {
    return function (req: Request, res: Response, next: NextFunction) {
        if (methods.length === 0 || methods.includes(req.method as any)) {
            if (!req.user) {
                return res.inertia as any
                ?  res.redirect('/login')
                : res.status(401).json({message: 'Unauthorized'})
            }

            if (process.env.USER_PHONE_VERIFICATION === 'true') {
                if (!req.user.phoneVerified) {
                    return res.inertia as any
                    ?  res.divert('verify.phone')
                    : res.status(401).json({message: 'Unverified phone'})
                }
            }

            if (process.env.USER_EMAIL_VERIFICATION === 'true') {
                if (!req.user.emailVerified) {
                    return res.inertia as any
                    ?  res.divert('verify.email')
                    : res.status(401).json({message: 'Unverified email'})
                }
            }
        }
        next();
    }
}
