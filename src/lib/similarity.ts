import type { VocabEntry } from "@/types/vocab";

/**
 * Pick distractor options for multiple-choice mode.
 * Returns 3 "wrong" entries from the same topic that are plausibly
 * similar to the correct answer (to make the quiz challenging).
 */
export function pickDistractors(
  correct: VocabEntry,
  pool: VocabEntry[],
  count: number = 3
): VocabEntry[] {
  // Exclude the correct answer itself
  const candidates = pool.filter((e) => e.id !== correct.id && e.type === correct.type);

  if (candidates.length <= count) {
    return candidates;
  }

  // Score each candidate by similarity to the correct answer
  const scored = candidates.map((candidate) => ({
    entry: candidate,
    score: similarityScore(correct, candidate),
  }));

  // Sort by score descending (most similar first)
  scored.sort((a, b) => b.score - a.score);

  // Take top `count` candidates
  return scored.slice(0, count).map((s) => s.entry);
}

/**
 * Compute a similarity score between two vocab entries.
 * Higher = more similar = better distractor.
 */
function similarityScore(a: VocabEntry, b: VocabEntry): number {
  let score = 0;

  // Same part of speech
  if (a.partOfSpeech === b.partOfSpeech) score += 3;

  // Similar English length (within 50% of each other)
  const lenRatio = Math.min(a.english.length, b.english.length) /
    Math.max(a.english.length, b.english.length);
  score += lenRatio * 2;

  // Shared kana characters
  const aChars = new Set(a.kana.split(""));
  const bChars = new Set(b.kana.split(""));
  const intersection = [...aChars].filter((c) => bChars.has(c)).length;
  score += intersection;

  // Same JLPT level
  if (a.jlptLevel === b.jlptLevel) score += 2;

  // Shared tags
  const sharedTags = a.tags.filter((t) => b.tags.includes(t)).length;
  score += sharedTags;

  return score;
}

/**
 * Shuffle an array in place using Fisher-Yates.
 */
export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Build a multiple-choice question with the correct answer
 * plus 3 distractors, shuffled randomly.
 */
export function buildChoices(
  correct: VocabEntry,
  pool: VocabEntry[]
): { entries: VocabEntry[]; correctIndex: number } {
  const distractors = pickDistractors(correct, pool);
  const allChoices = shuffle([correct, ...distractors]);
  const correctIndex = allChoices.findIndex((e) => e.id === correct.id);
  return { entries: allChoices, correctIndex };
}
