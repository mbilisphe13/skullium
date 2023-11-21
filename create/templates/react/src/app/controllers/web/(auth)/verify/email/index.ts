import {Request, Response} from "express";
import {Controller} from "@skull/core";
import {auth, limit} from "@skull/core";


export default class extends Controller {
    middlewares = [
        auth(),
        limit(1, 60, 'POST')
    ]

    name = 'verify.email'

    async GET(req: Request, res: Response) {
        if (req.user?.emailVerified) {
            return res.divert('dashboard')
        }
        await res.inertia('Auth/VerifyEmail')
    }

    async POST(req: Request, res: Response) {
        if (req.user?.emailVerified) {
            return res.divert('dashboard')
        }

        req.user?.sendEmailVerificationNotification(req)

        res.success('Email verification link sent successfully')

        return res.back()
    }


}
