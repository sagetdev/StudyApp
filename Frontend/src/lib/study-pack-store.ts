import type { StudyPack } from '@/types/study-pack';

let currentStudyPack: StudyPack | null = null;

export function setCurrentStudyPack(pack: StudyPack) {
  currentStudyPack = pack;
}

export function getCurrentStudyPack() {
  return currentStudyPack;
}
