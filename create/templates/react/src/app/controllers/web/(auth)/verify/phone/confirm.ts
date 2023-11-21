import {Request, Response} from "express";
import {Controller} from "@skullium/core";
import {auth, signed} from "@skullium/core";


export default class extends Controller {
    middlewares = [auth(), signed()]
    name = 'verify.phone.confirm'

    async GET(req: Request, res: Response) {
        await req.user?.verifyPhone()

        res.success('Phone verified successfully')
        res.divert('dashboard')
    }
}
