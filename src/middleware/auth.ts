
// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


declare global {
namespace Express {
interface Request {
user?: { id: string; email: string; role: string };
}
}
}


export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
const auth = req.headers.authorization;
if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
const token = auth.split(' ')[1];
try {
const payload = jwt.verify(token, process.env.JWT_SECRET || 'devsecret') as any;
req.user = { id: payload.id, email: payload.email, role: payload.role };
return next();
} catch (err) {
return res.status(401).json({ message: 'Invalid token' });
}
};


export const requireOrganizer = (req: Request, res: Response, next: NextFunction) => {
if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
if (req.user.role !== 'organizer') return res.status(403).json({ message: 'Forbidden' });
next();
};