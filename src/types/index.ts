export type Level = "A1" | "A2" | "B1" | "B2" | "C1";

export type Category = "world" | "culture" | "science" | "sports" | "fun";

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  titles?: Record<Level, string> | null;
  subtitles?: Record<Level, string> | null;
  category: Category;
  tags: string[];
  source: string;
  sourceUrl: string;
  publishedAt: string;
  wordCount: Record<Level, number>;
  readTime: Record<Level, number>;
  heroImage: string;
  heroAlt: string;
  heroCredit?: string;
  content: Record<Level, string>;
  audio: Record<Level, { url: string; duration: number }>;
  vocabulary: VocabularyItem[];
  exercises: Record<Level, ExerciseSet>;
}

export interface VocabularyItem {
  word: string;
  definition: string;
  level: Level;
}

export interface ExerciseSet {
  comprehension: ComprehensionQuestion[];
  vocabularyMatching: VocabularyMatchingExercise;
  gapFill: GapFillExercise;
  wordOrder: WordOrderExercise;
  trueFalse: TrueFalseExercise;
  discussion: string[];
}

export interface ComprehensionQuestion {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
}

export interface VocabularyMatchingExercise {
  pairs: { word: string; definition: string }[];
}

export interface GapFillExercise {
  text: string;
  blanks: { id: number; answer: string }[];
  wordBank: string[];
}

export interface WordOrderExercise {
  sentences: {
    scrambled: string[];
    correct: string;
  }[];
}

export interface TrueFalseExercise {
  statements: {
    text: string;
    answer: boolean;
    explanation: string;
  }[];
}
