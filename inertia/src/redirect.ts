import { Request, Response } from "express";

export function redirect(req: Request, res: Response){

    function redirect(url: string): void {
        const statusCode = ['PUT', 'PATCH', 'DELETE'].includes(req.method)
            ? 303
            : 302;

        res.writeHead(statusCode, {Location: url}).end();
    }

    function getUrl(name:string, parameters?: Record<string, any>) {
        const route = req.ziggy.routes[name];

        if (!route) {
            throw new Error(`Route with name '${name}' not found`);
        }

        let url = route.uri;

        // Replace URL parameters with actual values
        for (const param of route.parameters) {
            if (parameters?.hasOwnProperty(param)) {
                const value = parameters[param];
                url = url.replace(`:${param}`, value);
            } else {
                throw new Error(`Missing parameter '${param}' for route '${name}'`);
            }
        }

        for (const key in parameters) {
            if (!route.parameters.includes(key) && parameters.hasOwnProperty(key)) {
                const value = parameters[key];
                url += url.includes('?') ? `&${key}=${value}` : `?${key}=${value}`;
            }
        }

        return `/${url}`;
    }

    const divert = function (name: string, parameters?: Record<string, any>){

        redirect(getUrl(name, parameters))
    }

    const back = function(){
        const referer = req.get('referer');
        if (referer != null) {
           return  redirect(referer);
        }

        return redirect('/')
    }

    return {divert, back}
}