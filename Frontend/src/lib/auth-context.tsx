import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { signInRequest, signUpRequest } from '@/lib/api';
import { getPersistedSession, persistSession } from '@/lib/local-storage';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getPersistedSession<AuthSession>().then((saved) => {
      if (mounted) setSession(saved);
    }).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    loading,
    signIn: async (email, password) => {
      const next = await signInRequest(email.trim().toLowerCase(), password);
      await persistSession(next);
      setSession(next);
    },
    signUp: async (email, password) => {
      const next = await signUpRequest(email.trim().toLowerCase(), password);
      await persistSession(next);
      setSession(next);
    },
    signOut: async () => {
      await persistSession(null);
      setSession(null);
    },
  }), [session, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth doit être utilisé dans AuthProvider.');
  return context;
}
