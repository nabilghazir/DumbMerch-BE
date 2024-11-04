import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';

export const authorization = (role: Role) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = res.locals.user
            if (user.role !== "ADMIN" && user.role !== role) {
                res.status(403).json({ message: 'Unauthorized' })
                return
            }
            next();
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

}

