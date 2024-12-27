import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';

export interface CustomRequest extends Request {
  userId?: string | null;
}

export const verifyTokenMiddleware = () => {
  return async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers.authorization?.split(' ')[1];
    const isOptional = req.method === 'GET';

    if (!token) {
      if (isOptional) {
        req.userId = null;
        next();
        return;
      }
      res.status(401).json({ error: 'Token not provided' });
      return;
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.userId = decodedToken.uid;
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
