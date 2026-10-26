import { Platform } from 'react-native';
import type { AuthSession } from '@/types/study-pack';
import type { StudyPack } from '@/types/study-pack';

const defaultBaseUrl = Platform.OS === 'android'
  ? 'http://10.0.2.2:4000/api'
  : 'http://localhost:4000/api';

export const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL || defaultBaseUrl).replace(/\/$/, '');

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    });
  } catch {
    throw new Error(`Impossible de joindre le serveur. Vérifie son état et l’URL API (${API_BASE_URL}).`);
  }

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = body?.message || body?.error || 'Une erreur est survenue.';
    throw new Error(typeof message === 'string' ? message : 'Une erreur est survenue.');
  }
  return body as T;
}

export function signInRequest(email: string, password: string) {
  return request<AuthSession>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
}

export function signUpRequest(email: string, password: string) {
  return request<AuthSession>('/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) });
}

export function generateStudyPack(question: string, token: string) {
  return request<StudyPack>('/ai/ask', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ question }),
  });
}
