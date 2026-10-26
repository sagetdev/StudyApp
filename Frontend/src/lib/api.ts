import { Platform } from 'react-native';
import type { AuthSession, StudyPack } from '@/types/study-pack';

const defaultBaseUrl = Platform.OS === 'android'
  ? 'http://10.0.2.2:4000/api'
  : 'http://localhost:4000/api';

export const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL || defaultBaseUrl).replace(/\/$/, '');

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });
  } catch {
    throw new Error(`Impossible de joindre le serveur. Vérifie son état et l’URL API (${API_BASE_URL}).`);
  }
  const body = response.status === 204 ? null : await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = body?.message || body?.error || 'Une erreur est survenue.';
    throw new Error(typeof message === 'string' ? message : 'Une erreur est survenue.');
  }
  return body as T;
}

export interface SavedStudyPack {
  id: string;
  title: string;
  sourceText?: string | null;
  content: StudyPack;
  createdAt: string;
  updatedAt?: string;
}

export interface StudyNote {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt?: string;
}

export function signInRequest(email: string, password: string) {
  return request<AuthSession>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
}

export function signUpRequest(email: string, password: string) {
  return request<AuthSession>('/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) });
}

export function generateStudyPack(question: string, token: string) {
  return request<StudyPack>('/ai/ask', { method: 'POST', body: JSON.stringify({ question }) }, token);
}

export async function listStudyPacks(token: string): Promise<SavedStudyPack[]> {
  const result = await request<{ items: SavedStudyPack[] }>('/study-packs', {}, token);
  return result.items;
}

export function createStudyPack(content: StudyPack, sourceText: string, token: string) {
  return request<SavedStudyPack>('/study-packs', {
    method: 'POST',
    body: JSON.stringify({ content, sourceText }),
  }, token);
}

export function removeStudyPack(id: string, token: string) {
  return request<void>(`/study-packs/${encodeURIComponent(id)}`, { method: 'DELETE' }, token);
}

export async function listNotes(token: string): Promise<StudyNote[]> {
  const result = await request<{ items: StudyNote[] }>('/notes', {}, token);
  return result.items;
}

export function createNote(title: string, body: string, token: string) {
  return request<StudyNote>('/notes', { method: 'POST', body: JSON.stringify({ title, body }) }, token);
}

export function removeNote(id: string, token: string) {
  return request<void>(`/notes/${encodeURIComponent(id)}`, { method: 'DELETE' }, token);
}
