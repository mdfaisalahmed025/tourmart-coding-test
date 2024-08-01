// types/express.d.ts
// Adjust the import path as necessary

import { User } from "./entities/user.entity";

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}
