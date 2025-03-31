import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logError } from '../utilities/logger';

declare module 'express' {
  interface Request {
    user?: {
      userId: number;
      username: string;
    };
  }
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    const error = new Error('Access token missing');
    console.error('[Middleware]', logError(error));
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
    (err, decoded) => {
      if (err) {
        const error = new Error(`Token verification failed: ${err.name}`);
        console.error(
          '[Middleware]',
          logError(error),
          '- Details:',
          err.message
        );
        return res.status(403).json({
          error: 'Invalid token',
          details:
            err.name === 'TokenExpiredError'
              ? 'Token expired'
              : 'Invalid token',
        });
      }

      req.user = decoded as { userId: number; username: string };
      next();
    }
  );
};
