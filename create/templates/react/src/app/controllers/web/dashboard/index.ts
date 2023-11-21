import {Request, Response} from "express";
import {Controller} from "@skullium/core";
import {verified} from "@skullium/core";

export default class extends Controller {

    middlewares = [verified()]
    name = 'dashboard'

    async GET(req: Request, res: Response) {
        await res.inertia('Dashboard')
    }
}
