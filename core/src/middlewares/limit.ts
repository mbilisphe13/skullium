import {NextFunction, Request, Response} from "express";

type HttpVerb = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD"

export function limit(limit: number, seconds: number = 60, ...methods:HttpVerb[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (methods.length === 0 || methods.includes(req.method as any)) {
            const now = Date.now();

            // Create an object to store request timestamps, indexed by route URLs
            req.session.requestTimestamps = req.session.requestTimestamps || {};

            // Ensure there's an array for the current route URL
            req.session.requestTimestamps[req.url] = req.session.requestTimestamps[req.url] || [];

            // Remove timestamps older than the specified time frame
            req.session.requestTimestamps[req.url] = req.session.requestTimestamps[req.url].filter(
                (timestamp: number) => now - timestamp <= seconds * 1000
            );

            // Calculate the remaining time until the next request is allowed
            const remainingTime = req.session.requestTimestamps[req.url][0]
                ? seconds - Math.floor((now - req.session.requestTimestamps[req.url][0]) / 1000)
                : 0;

            // Check if the client exceeded the limit
            if (req.session.requestTimestamps[req.url].length >= limit) {
                if (res.inertia as any) {
                    res.error(`Rate limit exceeded. Try again in ${remainingTime} seconds.`);
                    return res.back();
                }
                return res.status(429).json({
                    message: `Rate limit exceeded. Try again in ${remainingTime} seconds.`,
                });
            }

            req.session.requestTimestamps[req.url].push(now);

        }
        next();
    };
}
