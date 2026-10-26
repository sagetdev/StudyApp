import type { StudyPack } from '@/types/study-pack';

let currentStudyPack: StudyPack | null = null;

export async function initializeStudyPackStore() {
  // Saved content is loaded from the authenticated API in the library screen.
}

export async function setCurrentStudyPack(pack: StudyPack) {
  currentStudyPack = pack;
}

export function getCurrentStudyPack() {
  return currentStudyPack;
}
