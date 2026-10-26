import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Type utilisateur basique pour la simulation
interface User {
  id: string;
  email: string;
  passwordHash: string;
}

interface Register {
  email: string;
  password: string;
}

interface Login {
  email: string;
  password: string;
}
interface AuthResponse {
  user: {
    id: string;
    email: string;
  };
  token: string;
}

// SIMULATION DE BASE DE DONNÉES (À remplacer par ton ORM / DB)
const usersDb: User[] = [];

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_change_me';
const JWT_EXPIRES_IN = '7d';

export class AuthService {
  
  // 1. Inscription
  async register(data: Register): Promise<AuthResponse> {
    const { email, password } = data;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = usersDb.find((user) => user.email === email);
    if (existingUser) {
      throw new Error('Cet email est déjà utilisé.');
    }

    // Hacher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Créer le nouvel utilisateur
    const newUser: User = {
      id: Date.now().toString(), // Génération d'ID temporaire
      email,
      passwordHash,
    };

    usersDb.push(newUser);

    // Générer le JWT
    const token = this.generateToken(newUser.id, newUser.email);

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
      },
      token,
    };
  }

  // 2. Connexion
  async login(data: Login): Promise<AuthResponse> {
    const { email, password } = data;

    // Récupérer l'utilisateur
    const user = usersDb.find((u) => u.email === email);
    if (!user) {
      throw new Error('Identifiants invalides.');
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Identifiants invalides.');
    }

    // Générer le JWT
    const token = this.generateToken(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      token,
    };
  }

  // Utilitaire privé pour signer les JWT
  private generateToken(userId: string, email: string): string {
    return jwt.sign({ id: userId, email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
  }
} 