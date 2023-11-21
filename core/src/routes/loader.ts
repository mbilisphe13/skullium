import express, { RequestHandler } from "express";
import {controllerRoutesHandler} from "./controllers-routes-handler";
import {getControllers} from "./get-controllers";
import { session } from "../core/session";
import { user } from "../middlewares/user";
import { ziggy } from "../middlewares/ziggy";
import { AuthModel } from "../core/auth-model";

export async function webControllerRoutesLoader(middlewares: RequestHandler[] = [], userModel: typeof AuthModel) {
    const routeNames: Record<string, any> = {}
    const main = express.Router()

    if(middlewares.length> 0){
        main.use(middlewares)
    }


    for (const [url, controller] of await getControllers('web')) {
        const {router, methods, parameters} = await controllerRoutesHandler(url, controller)

        if (controller.name) {
            routeNames[controller.name] = {
                uri: url.startsWith('/') ? url.substring(1) : url,
                methods,
                parameters,
            }
        }

        main.use(router)
    }
    console.log({routeNames})
    return {router: express.Router().use([
        session(),
        ziggy(routeNames),
        user(userModel),
        main
    ])}
}

export async function apiControllerRoutesLoader(middlewares: RequestHandler[] = [], userModel: typeof AuthModel) {
    const main = express.Router()

    if(middlewares.length> 0){
        main.use(middlewares)
    }

    for (const [url, controller] of await getControllers('api')) {
        const {router} = await controllerRoutesHandler(url, controller)

        main.use(router)
    }

    return {router: express.Router().use([
        user(userModel),
        main
    ])}
}