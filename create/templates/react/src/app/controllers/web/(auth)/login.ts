import {Request, Response} from "express";
import {Controller, guest, Validate} from "@skull/core";
import {User} from "#/models/user";

const schema = {
    phone: 'required|digits:10',
    password: 'required',
}

type Validated = Record<keyof typeof schema, any>

export default class extends Controller {
    middlewares = [guest()]
    name = 'login'

    async GET(req: Request, res: Response) {
        await res.inertia('Auth/Login', {intended: req.query.intended})
    }

    @Validate(schema)
    async POST(req: Request, res: Response) {
        const {phone, password} = <Validated>req.skull.validated
        const user = await User.findOneBy({phone});

        if (!user) {
            res.error('user not found')
            return res.back()
        }

        if (!await user.checkPassword(password)) {
            res.error('invalid password')
            return res.back()
        }

        req.session.userId = user.id

        res.success('Login successful')

        return req.query.intended
            ? res.redirect(req.query.intended as string)
            : res.divert('dashboard')
    }
}
