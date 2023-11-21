import {Controller} from "../core/controller";
import express, {RequestHandler} from "express";

export async function controllerRoutesHandler(url: string, controller: Controller) {
    const router = express.Router()
    let methods: string[] = []
    const parameters: string[] = []

    url.split('/').forEach((segment: string) => {
        if (segment.startsWith(':')) {
            const parameterName = segment.slice(1)
            parameters.push(parameterName)
        }
    })

    if (controller['GET' as keyof Controller]) {
        router.get(url, controller.getMiddlewares(), controller['GET' as keyof Controller] as RequestHandler)
        methods = [...new Set([...methods, 'GET'])]
    }

    if (controller['POST' as keyof Controller]) {
        router.post(url, controller.getMiddlewares(), controller['POST' as keyof Controller] as RequestHandler)
        methods = [...new Set([...methods, 'POST'])]
    }

    if (controller['PUT' as keyof Controller]) {
        router.put(url, controller.getMiddlewares(), controller['PUT' as keyof Controller] as RequestHandler)
        methods = [...new Set([...methods, 'PUT'])]
    }

    if (controller['DELETE' as keyof Controller]) {
        router.delete(url, controller.getMiddlewares(), controller['DELETE' as keyof Controller] as RequestHandler)
        methods = [...new Set([...methods, 'DELETE'])]
    }

    return {router, methods, parameters}
}