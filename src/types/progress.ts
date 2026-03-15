export interface ProgressRecord {
  id: number;
  vocabId: string;
  easinessFactor: number;
  interval: number;
  repetitions: number;
  dueDate: number; // Unix timestamp (ms)
  lastReviewed: number | null;
  correctCount: number;
  incorrectCount: number;
  createdAt: number;
}

/** SM-2 quality rating (0-5) */
export type SM2Quality = 0 | 1 | 2 | 3 | 4 | 5;

/** UI rating mapped to SM-2 quality */
export type UIRating = "again" | "hard" | "good" | "easy";

export const UI_RATING_TO_SM2: Record<UIRating, SM2Quality> = {
  again: 0,
  hard: 2,
  good: 4,
  easy: 5,
};
