export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface ReferenceImage {
  url: string;
  alt: string;
  caption: string;
  sourceTitle?: string;
  sourceUrl?: string;
  license?: string;
}

export interface CourseCheckQuestion {
  question: string;
  expectedAnswer: string;
  explanation: string;
}

export interface CoursePage {
  title: string;
  objective?: string;
  content: string;
  examples: string[];
  keyPoints: string[];
  commonMistakes?: string[];
  checkQuestions?: CourseCheckQuestion[];
  referenceImages?: ReferenceImage[];
}

export interface StudyPack {
  overview: {
    title: string;
    summary: string;
    keyTakeaways: string[];
    estimatedStudyTimeMinutes?: number;
  };
  coursePages?: CoursePage[];
  glossary: Array<{ term: string; definition: string }>;
  flashcards: Array<{ front: string; back: string; category?: string; difficulty: Difficulty }>;
  multipleChoiceQuiz: Array<{ question: string; options: string[]; correctAnswer: string; explanation: string }>;
  activeRecallQuestions: Array<{ question: string; expectedAnswer: string; hint?: string }>;
  examQuestions: Array<{ question: string; gradingCriteria: string[] }>;
  aiTutorPrompts: string[];
}

export interface AuthUser { id: string; email: string }
export interface AuthSession { user: AuthUser; token: string }
