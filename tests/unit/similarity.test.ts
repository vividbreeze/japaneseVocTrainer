import { describe, it, expect } from "vitest";
import { pickDistractors, shuffle, buildChoices } from "@/lib/similarity";
import type { VocabEntry } from "@/types/vocab";

const makeEntry = (overrides: Partial<VocabEntry> & { id: string }): VocabEntry => ({
  topicId: "directions",
  type: "word",
  japanese: "右",
  kana: "みぎ",
  romaji: "migi",
  english: "right",
  tags: ["n5"],
  jlptLevel: "N5",
  partOfSpeech: "noun",
  ...overrides,
});

const pool: VocabEntry[] = [
  makeEntry({ id: "a", english: "right", kana: "みぎ", romaji: "migi" }),
  makeEntry({ id: "b", english: "left", kana: "ひだり", romaji: "hidari" }),
  makeEntry({ id: "c", english: "straight", kana: "まっすぐ", romaji: "massugu" }),
  makeEntry({ id: "d", english: "front", kana: "まえ", romaji: "mae" }),
  makeEntry({ id: "e", english: "back", kana: "うしろ", romaji: "ushiro" }),
];

describe("pickDistractors", () => {
  it("returns 3 distractors", () => {
    const correct = pool[0];
    const distractors = pickDistractors(correct, pool, 3);
    expect(distractors).toHaveLength(3);
  });

  it("never includes the correct answer", () => {
    const correct = pool[0];
    const distractors = pickDistractors(correct, pool, 3);
    expect(distractors.every((d) => d.id !== correct.id)).toBe(true);
  });

  it("returns fewer if pool is small", () => {
    const smallPool = pool.slice(0, 3);
    const distractors = pickDistractors(smallPool[0], smallPool, 3);
    expect(distractors.length).toBeLessThanOrEqual(2);
  });
});

describe("shuffle", () => {
  it("preserves all elements", () => {
    const arr = [1, 2, 3, 4, 5];
    const shuffled = shuffle(arr);
    expect(shuffled.sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it("does not mutate original array", () => {
    const arr = [1, 2, 3];
    shuffle(arr);
    expect(arr).toEqual([1, 2, 3]);
  });
});

describe("buildChoices", () => {
  it("returns 4 choices total", () => {
    const correct = pool[0];
    const { entries } = buildChoices(correct, pool);
    expect(entries).toHaveLength(4);
  });

  it("correct answer is in the choices", () => {
    const correct = pool[0];
    const { entries, correctIndex } = buildChoices(correct, pool);
    expect(entries[correctIndex].id).toBe(correct.id);
  });

  it("choices are shuffled (correct not always first)", () => {
    // Run many times — correct answer should not always be at index 0
    let allFirst = true;
    for (let i = 0; i < 20; i++) {
      const { correctIndex } = buildChoices(pool[0], pool);
      if (correctIndex !== 0) {
        allFirst = false;
        break;
      }
    }
    expect(allFirst).toBe(false);
  });
});
