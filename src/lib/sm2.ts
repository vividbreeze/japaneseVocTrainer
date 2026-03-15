/**
 * SM-2 Spaced Repetition Algorithm
 * Based on the original SuperMemo SM-2 algorithm by Piotr Wozniak.
 *
 * Quality scale:
 *   0 = complete blackout (forgot)
 *   1 = incorrect response (but upon seeing answer, it seemed easy)
 *   2 = incorrect response, but correct answer was easy to recall
 *   3 = correct response with serious difficulty
 *   4 = correct response after a hesitation
 *   5 = perfect response
 *
 * UI maps: "again"→0, "hard"→2, "good"→4, "easy"→5
 */

export interface SM2State {
  easinessFactor: number; // EF, starts 2.5, min 1.3
  interval: number;       // days until next review
  repetitions: number;    // consecutive successful reviews
  dueDate: number;        // Unix timestamp (ms) for next review
}

export type SM2Quality = 0 | 1 | 2 | 3 | 4 | 5;

const MIN_EF = 1.3;
const INITIAL_EF = 2.5;

/** Create a new SM-2 state for a card that has never been reviewed */
export function createInitialState(now: number = Date.now()): SM2State {
  return {
    easinessFactor: INITIAL_EF,
    interval: 0,
    repetitions: 0,
    dueDate: now, // due immediately (new card)
  };
}

/**
 * Apply one SM-2 review and return the updated state.
 * Pure function — takes state in, returns new state.
 */
export function applyReview(state: SM2State, quality: SM2Quality, now: number = Date.now()): SM2State {
  let { easinessFactor, interval, repetitions } = state;

  if (quality < 3) {
    // Failed: reset repetitions, short interval
    repetitions = 0;
    interval = 1;
  } else {
    // Passed
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easinessFactor);
    }
    repetitions += 1;
  }

  // Update EF (only updated on quality >= 0, but effectively penalizes low scores)
  easinessFactor = easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  easinessFactor = Math.max(MIN_EF, easinessFactor);

  const dueDate = now + interval * 24 * 60 * 60 * 1000;

  return { easinessFactor, interval, repetitions, dueDate };
}

/** Check if a card is due for review */
export function isDue(state: SM2State, now: number = Date.now()): boolean {
  return state.dueDate <= now;
}

/** How many days overdue is a card (negative = not yet due) */
export function daysOverdue(state: SM2State, now: number = Date.now()): number {
  return (now - state.dueDate) / (24 * 60 * 60 * 1000);
}
