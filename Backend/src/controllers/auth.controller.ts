import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export class AuthController {
  
  // Inscription (POST /api/auth/register)
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: 'L\'email et le mot de passe sont requis.' });
        return;
      }

      const result = await authService.register({ email, password });
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Erreur lors de l\'inscription.' });
    }
  }

  // Connexion (POST /api/auth/login)
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: 'L\'email et le mot de passe sont requis.' });
        return;
      }

      const result = await authService.login({ email, password });
      res.status(200).json(result);
    } catch (error: any) {
      res.status(401).json({ message: error.message || 'Erreur lors de la connexion.' });
    }
  }
}