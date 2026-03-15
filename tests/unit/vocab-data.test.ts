import { describe, it, expect } from "vitest";
import { ALL_VOCAB, VOCAB_BY_TOPIC } from "@data/index";
import type { VocabEntry } from "@data/types";

describe("Vocabulary data integrity", () => {
  it("loads more than 300 vocab entries total", () => {
    expect(ALL_VOCAB.length).toBeGreaterThan(300);
  });

  it("has 16 topics", () => {
    expect(Object.keys(VOCAB_BY_TOPIC).length).toBe(16);
  });

  it("all entries have required fields", () => {
    for (const entry of ALL_VOCAB) {
      expect(entry.id, `${entry.id} missing id`).toBeTruthy();
      expect(entry.topicId, `${entry.id} missing topicId`).toBeTruthy();
      expect(entry.type, `${entry.id} missing type`).toMatch(/^(word|sentence)$/);
      expect(entry.japanese, `${entry.id} missing japanese`).toBeTruthy();
      expect(entry.kana, `${entry.id} missing kana`).toBeTruthy();
      expect(entry.romaji, `${entry.id} missing romaji`).toBeTruthy();
      expect(entry.english, `${entry.id} missing english`).toBeTruthy();
      expect(Array.isArray(entry.tags), `${entry.id} tags must be array`).toBe(true);
    }
  });

  it("all entry IDs are unique", () => {
    const ids = ALL_VOCAB.map((e) => e.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("all entries have valid jlptLevel if set", () => {
    for (const entry of ALL_VOCAB) {
      if (entry.jlptLevel !== null) {
        expect(["N5", "N4", "N3"]).toContain(entry.jlptLevel);
      }
    }
  });

  it("each topic has at least 15 words and 3 sentences", () => {
    for (const [topicId, entries] of Object.entries(VOCAB_BY_TOPIC)) {
      const words = entries.filter((e: VocabEntry) => e.type === "word");
      const sentences = entries.filter((e: VocabEntry) => e.type === "sentence");
      expect(words.length, `${topicId} words`).toBeGreaterThanOrEqual(15);
      expect(sentences.length, `${topicId} sentences`).toBeGreaterThanOrEqual(3);
    }
  });
});
