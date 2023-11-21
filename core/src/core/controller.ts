import express, {Application, NextFunction, Request, RequestHandler, Response, Router} from "express";

export interface NamedRoutes {
    name: string;
    method: string;
    path: string;
    parameters: string[];
}


export class Controller {

    //The route name for ziggy route helper
    name: string;
    // A map to store the methods and their corresponding HTTP verbs and paths
    methodMap: Record<string, { verb: string; path: string }> = {};
    protected middlewares: RequestHandler[] = [(req: Request, res: Response, next: NextFunction) => next()];
    private namedRoutes: NamedRoutes[] = [];

    constructor() {
        // Iterate over the class prototype to populate the methodMap
        const proto = Object.getPrototypeOf(this);
        for (const methodName of Object.getOwnPropertyNames(proto)) {
            // @ts-ignore
            const method = this[methodName];
            if (method && method.verb && method.path) {
                this.methodMap[methodName] = {verb: method.verb, path: method.path};
            }
        }
    }

    getMiddlewares(): RequestHandler[] {
        return this.middlewares;
    }

    // Attaches all routes methods to the specified app
    attachRoutesToApp(app: Application, basePath: string = '/', middlewares: RequestHandler[] = []) {
        const router = express.Router();

        for (const method in this.methodMap) {
            this.attachRouteToApp(this, router, method, basePath);
        }

        const attachNamesMiddleware = (req: Request, res: Response, next: NextFunction) => {
            req.ziggy = {
                url: 'http://127.0.0.1:4000', // Set your Laravel URL here
                port: 4000, // Set your Laravel port here
                defaults: {},
                routes: {...req.ziggy?.routes, ...this.getRoutes()},
            };
            req.routeNames = [...req.routeNames || [], ...this.namedRoutes];
            next()
        }

        app.use('/', [attachNamesMiddleware, ...middlewares, ...this.middlewares], router);
    }

    private getRoutes(): Record<string, any> {
        const routes: Record<string, any> = {}

        for (const route of this.namedRoutes) {
            const {name, path, method, parameters} = route;
            routes[name] = {
                uri: path.startsWith('/') ? path.substring(1) : path,
                methods: [method.toUpperCase()],
            };
            if (parameters.length > 0) {
                routes[name].parameters = parameters;
            }
        }

        return routes;
    }

// Attaches a single route method to the specified app
    private attachRouteToApp(
        target: any,
        router: Router,
        method: string,
        basePath: string = '/',
    ) {
        const route = target[method];

        if (route.verb && route.path && route instanceof Function) {
            const verb = route.verb.toLowerCase() as 'get' | 'post' | 'put' | 'patch' | 'delete';
            const path = `${basePath.replace(/\/$/, '')}${route.path}`;
            const name = route.routeName;
            const parameters: string[] = [];

            if (name) {
                // Extract parameters from the path (e.g., "/:id")
                const pathSegments = path.split('/');
                pathSegments.forEach((segment: string) => {
                    if (segment.startsWith(':')) {
                        const parameterName = segment.slice(1); // Remove the leading ":"
                        parameters.push(parameterName);
                    }
                });

                this.namedRoutes.push({
                    name,
                    method: verb,
                    path,
                    parameters,
                });
            }

            router[verb](path, (req: Request, res: Response) => {
                route(req, res);
            });
        }
    }
}
