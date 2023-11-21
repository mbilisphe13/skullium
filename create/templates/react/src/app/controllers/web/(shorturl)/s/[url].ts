import {Request, Response} from "express";
import {Controller} from "@skull/core";
import {ShorturlService} from "@skull/core";

export default class extends Controller {
    name='shorturl'
    async GET(req: Request, res: Response) {
        const { url } = req.params;
        const original = await (new ShorturlService).resolve(url);

        if (!original) {
            return res.status(404).json({ error: 'NOT FOUND' });
        }

        return res.redirect(original);
    }
}
