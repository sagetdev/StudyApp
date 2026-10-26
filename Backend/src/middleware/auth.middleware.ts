import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_change_me';

// Interface pour typer l'objet utilisateur décodé du token
export interface JwtPayloadPayload {
  id: string;
  email: string;
}

// Étend l'interface Request d'Express pour y ajouter la propriété 'user'
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayloadPayload;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  
  // Le token est généralement transmis sous la forme : "Bearer <TOKEN>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Accès refusé. Aucun token fourni.' });
    return;
  }

  try {
    // Vérification et décodage du token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayloadPayload;
    
    // Ajout des données utilisateur à l'objet request pour les contrôleurs suivants
    req.user = decoded;
    
    next(); // Passe au contrôleur ou au middleware suivant
  } catch (error) {
    res.status(403).json({ message: 'Token invalide ou expiré.' });
    return;
  }
};