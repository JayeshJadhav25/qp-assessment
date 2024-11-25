import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AccessDeniedException, AuthFailedException } from '../exception/index';

const SECRET_KEY = process.env.JWT_SECRET || 'secretkey';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return next(new AuthFailedException('Invalid Token'));
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        (req as any).user = decoded;
        next();
    } catch (error) {
        next(new AuthFailedException('Invalid Token'));
    }
};

export const authorize = (roles: string[]): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const user = (req as any).user;

        if (!user || !roles.includes(user.role)) {
            return next(new AccessDeniedException('Access denied.'));
        }

        next();
    };
};
