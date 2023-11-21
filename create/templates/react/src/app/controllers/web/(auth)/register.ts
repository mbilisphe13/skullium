import {Request, Response} from "express";
import {Validate, Controller} from "@skull/core";
import {User} from "#/models/user";
import {guest} from "@skull/core";

const schema = {
    email: 'required|email|unique:user',
    phone: 'required|digits:10|unique:user',
    password: 'required|confirmed',
    firstName: 'required',
    lastName: 'required'
}

export default class extends Controller {
    middlewares = [guest()]
    name='register'

    async GET(req: Request, res: Response) {
        await res.inertia('Auth/Register')
    }

    @Validate(schema)
    async POST(req: Request, res: Response) {
        const user = await User.create({...req.skull.validated}).save()

        req.session.userId = user.id
        res.success('Registration successful')
        return res.divert('dashboard')
    }
}
