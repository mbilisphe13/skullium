import { Request, Response } from "express";

export function checkVersion(req: Request, res: Response, version: string): boolean {
    if (
        req.method === 'GET' &&
        req.headers['x-inertia'] &&
        req.headers['x-inertia-version'] !== version
    ) {
        res.writeHead(409, {'X-Inertia-Location': req.url}).end();
        return false;
    }
    return true;
}