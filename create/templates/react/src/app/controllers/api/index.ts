import {Request, Response} from "express";
import {Controller} from "@skull/core";

export default class UserController extends Controller {
    async GET(req: Request, res: Response) {

        res.json({api: 'skull v 0.0.1'})
    }
}