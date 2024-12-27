import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';
export interface CustomRequest extends Request {
    userId?: string | null;
}
export interface DatabaseHandlers {
    findOrCreateUser: (decodedToken: admin.auth.DecodedIdToken) => Promise<void>;
}
export declare const verifyTokenMiddleware: (dbHandlers: DatabaseHandlers, allowUnauthenticatedGet?: boolean) => (req: CustomRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=middleware.d.ts.map