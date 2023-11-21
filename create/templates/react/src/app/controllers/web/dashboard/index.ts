import {Request, Response} from "express";
import {Controller} from "@skull/core";
import {verified} from "@skull/core";

export default class extends Controller {

    middlewares = [verified()]
    name = 'dashboard'

    async GET(req: Request, res: Response) {
        await res.inertia('Dashboard')
    }
}
