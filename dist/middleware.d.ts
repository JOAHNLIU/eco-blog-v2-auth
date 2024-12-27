import { Request, Response, NextFunction } from 'express';
export interface CustomRequest extends Request {
    userId?: string | null;
}
export declare const verifyTokenMiddleware: (req: CustomRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=middleware.d.ts.map