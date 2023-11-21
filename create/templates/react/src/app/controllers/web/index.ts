import {Request, Response} from "express";
import {Controller} from "@skull/core";

export default class extends Controller {
    name='home'
    async GET(req: Request, res: Response) {
        await res.inertia('Home')
    }
}
