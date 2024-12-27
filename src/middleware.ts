import { Request, Response, NextFunction } from "express";
import { FirebaseAuthLibrary } from "./firebase";

interface MiddlewareOptions {
  authLibrary: FirebaseAuthLibrary;
  findOrCreateUser: (uid: string, name?: string, email?: string) => Promise<any>;
  updateUserLastLogin: (user: any) => Promise<void>;
}

export function createAuthMiddleware(options: MiddlewareOptions) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    const isOptional = req.method === "GET";

    if (!token) {
      if (isOptional) {
        req.userId = null;
        return next();
      }
      return res.status(401).json({ error: "Token not provided" });
    }

    try {
      const decodedToken = await options.authLibrary.verifyToken(token);
      req.userId = decodedToken.uid;

      const [user] = await options.findOrCreateUser(
        decodedToken.uid,
        decodedToken.name || "Anonymous",
        decodedToken.email || null
      );

      if (user) {
        await options.updateUserLastLogin(user);
      }
    } catch (error) {
      console.error("Token verification failed:", error);

      if (!isOptional) {
        return res.status(401).json({ error: "Invalid token" });
      }

      req.userId = null;
    }

    next();
  };
}
