import {NextFunction, Request, Response} from 'express';
import { Unauthorized } from '../core';

export const role = (role: 'staff' | 'admin') => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user

        if (role === 'admin' && !user?.isAdmin) {
            return next(new Unauthorized('Unauthorized'))
        }

        if (role === 'staff' && !user?.isStaff) {
            return next(new Unauthorized('Unauthorized'))
        }

        next()
    };
};
