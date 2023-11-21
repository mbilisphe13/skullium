import {Request, Response} from "express";
import {Controller} from "@skullium/core";
import {auth} from "@skullium/core";

const schema = {
    phone: 'required|digits:10',
    password: 'required',
}

export default class extends Controller {
    middlewares = [auth()]
    name = 'logout'

    async POST(req: Request, res: Response) {
        req.session.destroy()
        return res.divert('login')
    }
}
