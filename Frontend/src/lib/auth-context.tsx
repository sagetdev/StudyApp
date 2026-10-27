import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInRequest, signUpRequest } from '@/lib/api';
import type { AuthSession } from '@/types/study-pack';

const SESSION_STORAGE_KEY = 'studyapp:auth-session:v1';

interface AuthContextValue {
  session: AuthSession | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function readStoredSession(): Promise<AuthSession | null> {
  try {
    const raw = Platform.OS === 'web'
      ? (typeof localStorage !== 'undefined' ? localStorage.getItem(SESSION_STORAGE_KEY) : null)
      : await AsyncStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === 'object' && parsed !== null &&
      'token' in parsed && typeof parsed.token === 'string' &&
      'user' in parsed && typeof parsed.user === 'object' && parsed.user !== null &&
      'id' in parsed.user && typeof parsed.user.id === 'string' &&
      'email' in parsed.user && typeof parsed.user.email === 'string'
    ) return parsed as AuthSession;
    await clearStoredSession();
    return null;
  } catch {
    return null;
  }
}

async function writeStoredSession(session: AuthSession): Promise<void> {
  const value = JSON.stringify(session);
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') localStorage.setItem(SESSION_STORAGE_KEY, value);
    return;
  }
  await AsyncStorage.setItem(SESSION_STORAGE_KEY, value);
}

async function clearStoredSession(): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(SESSION_STORAGE_KEY);
    return;
  }
  await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
}

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void readStoredSession().then((stored) => {
      if (active) setSession(stored);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    loading,
    signIn: async (email, password) => {
      const next = await signInRequest(email.trim().toLowerCase(), password);
      await writeStoredSession(next);
      setSession(next);
    },
    signUp: async (email, password) => {
      const next = await signUpRequest(email.trim().toLowerCase(), password);
      await writeStoredSession(next);
      setSession(next);
    },
    signOut: async () => {
      await clearStoredSession();
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
