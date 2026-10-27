import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'studyapp:revision-progress:v1';
const QUIZ_KEY = 'studyapp:latest-quiz-result:v1';

export type RevisionSession = {
  id: string; courseTitle: string; completedAt: string;
  flashcardsReviewed: number; quizCorrect: number; quizTotal: number;
  recallQuestions: number; examQuestions: number;
};
export type QuizResult = { courseTitle: string; correct: number; total: number };

export async function saveQuizResult(result: QuizResult) {
  try { await AsyncStorage.setItem(QUIZ_KEY, JSON.stringify(result)); } catch { /* L'historique reste facultatif. */ }
}
export async function clearLatestQuizResult() {
  try { await AsyncStorage.removeItem(QUIZ_KEY); } catch { /* Le parcours reste utilisable. */ }
}
export async function getLatestQuizResult(): Promise<QuizResult | null> {
  try { const raw = await AsyncStorage.getItem(QUIZ_KEY); return raw ? JSON.parse(raw) as QuizResult : null; }
  catch { return null; }
}
export async function recordRevisionSession(session: Omit<RevisionSession, 'id' | 'completedAt'>) {
  const entry: RevisionSession = { ...session, id: Date.now().toString(), completedAt: new Date().toISOString() };
  try { const existing = await getRevisionSessions(); await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...existing].slice(0, 100))); return entry; }
  catch { return null; }
}
export async function getRevisionSessions(): Promise<RevisionSession[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? value.filter((item): item is RevisionSession =>
      typeof item === 'object' && item !== null && typeof item.id === 'string' &&
      typeof item.courseTitle === 'string' && typeof item.completedAt === 'string' &&
      typeof item.quizCorrect === 'number' && typeof item.quizTotal === 'number'
    ) : [];
  } catch { return []; }
}
