import {Request, Response} from "express";
import {Controller} from "@skull/core";
import {auth, limit} from "@skull/core";

export default class extends Controller {
    middlewares = [
        auth(),
        limit(1, 60, 'POST')
    ]
    name = 'verify.phone'

    async GET(req: Request, res: Response) {
        if (req.user?.phoneVerified) {
            return res.divert('dashboard')
        }
        await res.inertia('Auth/VerifyPhone')
    }

    async POST(req: Request, res: Response) {
        if (req.user?.phoneVerified) {
            return res.divert('home')
        }

        req?.user?.sendPhoneVerificationNotification(req)

        res.success('Phone verification link sent successfully')
        res.back()
    }
}
