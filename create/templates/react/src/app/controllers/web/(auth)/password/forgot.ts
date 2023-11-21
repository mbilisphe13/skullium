import {Request, Response} from "express";
import {Controller} from "@skull/core";
import {guest, limit} from "@skull/core";
import {Validate} from "@skull/core";
import {User} from "#/models/user";

const schema = {
    email: 'required|email',
}
type Validated = Record<keyof typeof schema, any>

export default class extends Controller {
    middlewares = [
        guest(),
        limit(1, 60, 'POST')
    ]
    name = 'password.forgot'

    async GET(req: Request, res: Response) {
        await res.inertia('Auth/ForgotPassword', {
            signature: req.query.signature
        })
    }

    @Validate(schema)
    async POST(req: Request, res: Response) {
        const {email} = <Validated>req.skull.validated

        const user = await User.findOneBy({email})

        if (user) user.sendPasswordResetNotification(req)

        res.success('If the email exist on our records, the email has been sent successfully.')

        return res.divert('login')
    }

}
