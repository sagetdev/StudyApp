import React, { createContext, useContext, useMemo, useState } from 'react';
import { signInRequest, signUpRequest } from '@/lib/api';
import type { AuthSession } from '@/types/study-pack';

interface AuthContextValue {
  session: AuthSession | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const value = useMemo<AuthContextValue>(() => ({
    session,
    loading: false,
    signIn: async (email, password) => {
      const next = await signInRequest(email.trim().toLowerCase(), password);
      setSession(next);
    },
    signUp: async (email, password) => {
      const next = await signUpRequest(email.trim().toLowerCase(), password);
      setSession(next);
    },
    signOut: async () => { setSession(null); },
  }), [session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth doit être utilisé dans AuthProvider.');
  return context;
}
