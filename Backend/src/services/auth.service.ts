import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

interface Credentials { email: string; password: string }
interface AuthResponse { user: { id: string; email: string }; token: string }

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '7d';

function getJwtSecret(): string {
  if (!JWT_SECRET) throw new Error('JWT_SECRET doit être configuré dans les variables d’environnement.');
  return JWT_SECRET;
}

export class AuthService {
  async register(data: Credentials): Promise<AuthResponse> {
    const email = data.email.trim().toLowerCase();
    if (!email || !email.includes('@')) throw new Error('Adresse email invalide.');
    if (data.password.length < 8) throw new Error('Le mot de passe doit contenir au moins 8 caractères.');

    const passwordHash = await bcrypt.hash(data.password, 12);
    try {
      const user = await prisma.user.create({ data: { email, password: passwordHash }, select: { id: true, email: true } });
      return { user, token: this.generateToken(user.id, user.email) };
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
        throw new Error('Cet email est déjà utilisé.');
      }
      throw error;
    }
  }

  async login(data: Credentials): Promise<AuthResponse> {
    const email = data.email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new Error('Identifiants invalides.');
    }
    return { user: { id: user.id, email: user.email }, token: this.generateToken(user.id, user.email) };
  }

  private generateToken(userId: string, email: string): string {
    return jwt.sign({ id: userId, email }, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN });
  }
}
