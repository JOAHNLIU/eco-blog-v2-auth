import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';

export interface CustomRequest extends Request {
  userId?: string | null;
}

export interface DatabaseHandlers {
  findOrCreateUser: (decodedToken: admin.auth.DecodedIdToken) => Promise<void>;
}

export const verifyTokenMiddleware = (
  dbHandlers: DatabaseHandlers,
  allowUnauthenticatedGet: boolean = true
) => {
  return async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers.authorization?.split(' ')[1];
    const isOptional = allowUnauthenticatedGet && req.method === 'GET';

    if (!token) {
      if (isOptional) {
        req.userId = null;
        return next();
      }
      res.status(401).json({ error: 'Token not provided' });
      return;
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.userId = decodedToken.uid;

      await dbHandlers.findOrCreateUser(decodedToken);
    } catch (error) {
      console.error('Token verification failed:', error);

      if (!isOptional) {
        res.status(401).json({ error: 'Invalid token' });
        return;
      }

      req.userId = null;
    }

    next();
  };
};
