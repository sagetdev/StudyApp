// src/types/express.d.ts
import { Request } from 'express';

// Adjust the user object shape according to your application's user model/payload
interface AuthenticatedUser {
  id: string;
  email?: string;
  // add any other properties your auth middleware attaches (e.g. role, etc.)
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}