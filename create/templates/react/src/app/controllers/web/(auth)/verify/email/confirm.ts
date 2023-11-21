import {Request, Response} from "express";
import {Controller} from "@skullium/core";
import {auth, signed} from "@skullium/core";


export default class extends Controller {
    middlewares = [auth(), signed()]
    name = 'verify.email.confirm'

    async GET(req: Request, res: Response) {
        await req.user?.verifyEmail()
        res.success('Email verified successfully')
        res.divert('dashboard')
    }
}
