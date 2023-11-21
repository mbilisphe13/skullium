import {Request, Response} from "express";
import {Controller} from "@skull/core";
import {User} from "#/models/user";
import {Validate} from "@skull/core";
import {auth} from "@skull/core";

const schema = {
    phone: 'required|digits:10',
    password: 'required',
}

type Validated = Record<keyof typeof schema, any>

export default class extends Controller {
    middlewares = [auth()]
    name='profile'

    async GET(req: Request, res: Response) {
        await  res.inertia('Profile/Edit')
    }

    @Validate(schema)
    async POST(req: Request, res: Response) {
        const {phone, password} = <Validated>req.skull.validated
        const user = await User.findOneBy({phone});
        res.back()
    }

    @Validate({password: 'required'})
    async DELETE(req: Request, res: Response) {
        const {password} = <Validated>req.skull.validated

        if(!await req.user?.checkPassword(password)) {
            res.error('Invalid password')
            return res.back()
        }

        req.session.userId = null
        await User.delete({id: req.user?.id})
        res.success('Account deleted successful')
        return res.divert('home')
    }
}
