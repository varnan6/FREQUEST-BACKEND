import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      player?: { id: string; name: string; };
    }
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.player = { id: payload.id, name: payload.name };
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};