import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface JwtPayloadPayload { id: string; email: string }

declare global {
  namespace Express {
    interface Request { user?: JwtPayloadPayload }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : null;
  if (!token) {
    res.status(401).json({ message: 'Accès refusé. Connecte-toi pour continuer.' });
    return;
  }
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ message: 'Le serveur doit configurer JWT_SECRET.' });
    return;
  }
  try {
    const decoded = jwt.verify(token, secret);
    if (typeof decoded === 'string' || typeof decoded.id !== 'string' || typeof decoded.email !== 'string') {
      res.status(403).json({ message: 'Token invalide.' });
      return;
    }
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch {
    res.status(403).json({ message: 'Token invalide ou expiré.' });
  }
};
