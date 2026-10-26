import type { StudyPack } from '@/types/study-pack';
import { getCurrentSavedPack, persistCurrentPack } from '@/lib/local-storage';

let currentStudyPack: StudyPack | null = null;

export async function initializeStudyPackStore() {
  if (!currentStudyPack) currentStudyPack = await getCurrentSavedPack();
}

export async function setCurrentStudyPack(pack: StudyPack) {
  currentStudyPack = pack;
  await persistCurrentPack(pack);
}

export function getCurrentStudyPack() {
  return currentStudyPack;
}
