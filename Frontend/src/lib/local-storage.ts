import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  packs: '@studyapp/saved-packs/v1',
  currentPack: '@studyapp/current-pack/v1',
  notes: '@studyapp/notes/v1',
  session: '@studyapp/session/v1',
  preferences: '@studyapp/preferences/v1',
};

export interface SavedStudyPack {
  id: string;
  title: string;
  createdAt: string;
  pack: import('@/types/study-pack').StudyPack;
}

export interface StudyNote {
  id: string;
  title: string;
  body: string;
  createdAt: string;
}

async function readJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function getSavedPacks(): Promise<SavedStudyPack[]> {
  return readJson<SavedStudyPack[]>(KEYS.packs, []);
}

export async function savePack(pack: import('@/types/study-pack').StudyPack): Promise<SavedStudyPack> {
  const existing = await getSavedPacks();
  const title = pack.overview.title?.trim() || 'Cours sans titre';
  const record: SavedStudyPack = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    createdAt: new Date().toISOString(),
    pack,
  };
  await writeJson(KEYS.packs, [record, ...existing]);
  await writeJson(KEYS.currentPack, pack);
  return record;
}

export async function deleteSavedPack(id: string): Promise<void> {
  const packs = await getSavedPacks();
  await writeJson(KEYS.packs, packs.filter((item) => item.id !== id));
}

export async function getCurrentSavedPack(): Promise<import('@/types/study-pack').StudyPack | null> {
  return readJson<import('@/types/study-pack').StudyPack | null>(KEYS.currentPack, null);
}

export async function persistCurrentPack(pack: import('@/types/study-pack').StudyPack): Promise<void> {
  await writeJson(KEYS.currentPack, pack);
}

export async function getNotes(): Promise<StudyNote[]> {
  return readJson<StudyNote[]>(KEYS.notes, []);
}

export async function saveNote(title: string, body: string): Promise<StudyNote> {
  const notes = await getNotes();
  const note = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, title, body, createdAt: new Date().toISOString() };
  await writeJson(KEYS.notes, [note, ...notes]);
  return note;
}

export async function deleteNote(id: string): Promise<void> {
  const notes = await getNotes();
  await writeJson(KEYS.notes, notes.filter((note) => note.id !== id));
}

export async function getPersistedSession<T>(): Promise<T | null> {
  return readJson<T | null>(KEYS.session, null);
}

export async function persistSession<T>(session: T | null): Promise<void> {
  if (session === null) await AsyncStorage.removeItem(KEYS.session);
  else await writeJson(KEYS.session, session);
}

export async function getPreferences<T>(fallback: T): Promise<T> {
  return readJson<T>(KEYS.preferences, fallback);
}

export async function savePreferences<T>(preferences: T): Promise<void> {
  await writeJson(KEYS.preferences, preferences);
}
