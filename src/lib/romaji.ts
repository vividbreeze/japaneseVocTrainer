/**
 * Romaji normalization utilities for free-input comparison.
 * Handles common variant spellings so users aren't penalized
 * for using alternative but correct romanizations.
 */

/** Normalize a romaji string for loose comparison */
export function normalizeRomaji(input: string): string {
  let s = input.toLowerCase().trim();

  // Remove trailing punctuation
  s = s.replace(/[.!?。！？]+$/, "");

  // Long vowels: ou/oo/ō → o, uu/ū → u
  s = s.replace(/oo|ō/g, "o");
  s = s.replace(/ou/g, "o");
  s = s.replace(/uu|ū/g, "u");
  s = s.replace(/aa|ā/g, "a");
  s = s.replace(/ee|ē/g, "e");
  s = s.replace(/ii|ī/g, "i");

  // n ambiguity: "n'" → "n", "nn" → "n"
  s = s.replace(/n'/g, "n");
  s = s.replace(/nn/g, "n");

  // Normalize dashes in long vowels (katakana-style)
  s = s.replace(/[-ー]/g, "");

  // Collapse multiple spaces
  s = s.replace(/\s+/g, " ").trim();

  return s;
}

/**
 * Check if a romaji input matches a target, with normalization.
 * Allows multiple accepted forms (e.g. "shi / yo" patterns in numbers).
 */
export function romajiMatches(input: string, target: string): boolean {
  const normalInput = normalizeRomaji(input);

  // Target may contain " / " for alternative readings
  const alternatives = target.split(" / ").map(normalizeRomaji);

  return alternatives.some((alt) => normalInput === alt);
}

/**
 * Convert hiragana string to katakana.
 * Uses the Unicode offset between hiragana (U+3041-U+3096)
 * and katakana (U+30A1-U+30F6) blocks.
 */
export function hiraganaToKatakana(text: string): string {
  return text.replace(/[\u3041-\u3096]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) + 0x60)
  );
}

/**
 * Convert katakana string to hiragana.
 */
export function katakanaToHiragana(text: string): string {
  return text.replace(/[\u30A1-\u30F6]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );
}

/**
 * Levenshtein distance for fuzzy matching (used in free-input tolerance).
 */
export function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

/**
 * Check kana input against target with optional tolerance for sentences.
 * For words: exact match (after normalization).
 * For sentences: allow up to 10% edit distance.
 */
export function kanaMatches(
  input: string,
  targetKana: string,
  isSentence: boolean = false
): boolean {
  const normalInput = katakanaToHiragana(input.trim());
  const normalTarget = katakanaToHiragana(targetKana.replace(/[。！？]/g, ""));

  if (normalInput === normalTarget) return true;
  if (!isSentence) return false;

  const maxDist = Math.ceil(normalTarget.length * 0.1);
  return levenshtein(normalInput, normalTarget) <= maxDist;
}
