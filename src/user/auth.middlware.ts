// auth.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';// Import your user service
import { UserService } from './user.service';


@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly usersService: UserService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const token = req.headers.authorization?.split(' ')[1];
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: number };

                // Fetch user from database
                const user = await this.usersService.findOneById(decoded.userId);
                if (!user) {
                    return res.status(401).send('Unauthorized');
                }

                // Attach user to request
                req.user = user; // Attach the full user object

            } catch (error) {
                return res.status(401).send('Unauthorized');
            }
        }

        next();
    }
}
