import { RequestHandler, Express } from "express";
import { apiControllerRoutesLoader, webControllerRoutesLoader } from "./loader";
import { AuthModel } from "../core";


type Middlewares = { api: RequestHandler[], web: RequestHandler[] }

export async function bootRoutes(userModel: typeof AuthModel, webMiddlewares: RequestHandler[] = [], apiMiddlewares: RequestHandler[] = []) {

    const startTime = new Date();
    console.log(`Load routes...`);

    // Execute loaders concurrently using Promise.all
    const [{ router: apiRouter }, { router: webRouter }] =
        await Promise.all([
            apiControllerRoutesLoader(apiMiddlewares, userModel),
            webControllerRoutesLoader(webMiddlewares, userModel),
        ]);


    const endTime = new Date();
    const timeTakenInSeconds = (endTime.getTime() - startTime.getTime()) / 1000;

    console.log(`Loading routes completed in ${timeTakenInSeconds}`);

    return { apiRouter, webRouter };
}