import {Request, Response} from "express";
import {Controller} from "@skull/core";
import {guest, signed} from "@skull/core";
import {Validate} from "@skull/core";
import {User} from "#/models/user";

const schema = {
    password: 'required|confirmed|length:8',
    email: 'required|email',
    id: 'required'
}

type Validated = Record<keyof typeof schema, any>

export default class extends Controller {
    middlewares = [
        guest(),
        signed()
    ]

    name = 'password.reset'

    async GET(req: Request, res: Response) {
        await res.inertia('Auth/ResetPassword', {
            signature: req.query.signature,
            email: req.query.email,
            id: req.query.id
        })
    }

    @Validate(schema)
    async POST(req: Request, res: Response) {
        const {password,id} = <Validated>req.skull.validated

        const user = await User.findOneBy({id})

        if(user) {
            if(await user.checkPassword(password)) {
                res.error('Please use a different password.')
                return res.back()
            }

            user.password = password
            await user.save()

            req.session.userId = user.id
            res.success('password changed successfully')

            return res.divert('dashboard')
        }

        res.error('Password change failed')
        return res.back()
    }
}
