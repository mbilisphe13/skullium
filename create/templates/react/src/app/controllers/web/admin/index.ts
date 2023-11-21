import {Request, Response} from "express";
import {auth, Controller, role} from "@skull/core";

export default class extends Controller {
    middlewares = [auth(), role('staff')]
    name='admin.index'
    async GET(req: Request, res: Response) {
        await res.inertia('Admin/Home')
    }
}
