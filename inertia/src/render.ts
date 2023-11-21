import { Request, Response } from "express";
import { vite, ziggy } from "./template";

export function render(
    req: Request, 
    res: Response, 
    template: string, 
    version: string,
    flash : {success: string[], message: string[], error: string[]},
    errors : Record<string, string[]>,
    auth:  ((req:Request) =>Promise< Record<string, any>>)|undefined

    ) {

    return async function (component: string, props?: any): Promise<void> {
    
        let page: { [key: string]: any; } = {
            component,
            props: {},
            url: req.originalUrl || req.url,
            version: version
        };
    
        const allProps = {
            ...props,
            flash,
            errors,
            auth: auth? auth(req): {user:undefined}
        };
        
        let dataKeys: string[];
    
        if (req.headers['x-inertia-partial-data'] 
        && req.headers['x-inertia-partial-component'] === component) {
    
            dataKeys = (<string>req.headers['x-inertia-partial-data']).split(',',);
    
        } else {
    
            dataKeys = Object.keys(allProps);
        }
    
        for (const key of dataKeys) {
            if (typeof allProps[key] === 'function') {
                page.props[key] = await allProps[key]();
            } else {
                page.props[key] = allProps[key];
            }
        }
    
        if (req.headers['x-inertia']) {
            res.writeHead(200, {
                Vary: 'Accept',
                'X-Inertia': 'true',
                'Content-Type': 'application/json',
            }).end(JSON.stringify(page));
    
        } else {
           
            res.render(template, {
                page: JSON.stringify(page),
                ziggy: ziggy(req),
                vite : await vite(),
            })
        }
    }
}