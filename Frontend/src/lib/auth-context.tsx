import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { signInRequest, signUpRequest } from '@/lib/api';
import type { AuthSession } from '@/types/study-pack';

const SESSION_KEY = 'studyapp:auth-session:v1';

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
    AsyncStorage.getItem(SESSION_KEY)
      .then((raw) => { if (raw) setSession(JSON.parse(raw) as AuthSession); })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  const persist = async (next: AuthSession) => {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(next));
    setSession(next);
  };

  const value = useMemo<AuthContextValue>(() => ({
    session,
    loading,
    signIn: async (email, password) => persist(await signInRequest(email.trim().toLowerCase(), password)),
    signUp: async (email, password) => persist(await signUpRequest(email.trim().toLowerCase(), password)),
    signOut: async () => {
      await AsyncStorage.removeItem(SESSION_KEY);
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
