import {Request, Response} from "express";
import {Controller} from "@skull/core";
import {auth} from "@skull/core";
import {Validate} from "@skull/core";

const schema = {
    currentPassword: 'required',
    password: 'required|confirmed|length:8',
}

type Validated = Record<keyof typeof schema, any>

export default class extends Controller {
    middlewares = [auth()]
    name='profile.password'

    @Validate(schema)
    async PUT(req: Request, res: Response) {
        const {currentPassword, password} = <Validated>req.skull.validated

        if(req.user) {
            if(currentPassword === password) {
                res.error('New password must be different from current password')
                return res.back()
            }

            if(!(await req.user.checkPassword(currentPassword))) {
                res.error('invalid password')
                return res.back()
            }

            req.user.password = password
            await req.user.save()
            res.success('password changed successfully')
        }
        res.divert('profile')
    }
}
