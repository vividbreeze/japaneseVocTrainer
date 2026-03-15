import { describe, it, expect } from "vitest";
import {
  normalizeRomaji,
  romajiMatches,
  hiraganaToKatakana,
  katakanaToHiragana,
  levenshtein,
  kanaMatches,
} from "@/lib/romaji";

describe("normalizeRomaji", () => {
  it("lowercases input", () => {
    expect(normalizeRomaji("MIGI")).toBe("migi");
  });

  it("removes trailing punctuation", () => {
    expect(normalizeRomaji("sumimasen.")).toBe("sumimasen");
    expect(normalizeRomaji("ikura desu ka?")).toBe("ikura desu ka");
  });

  it("normalizes long vowel 'ou' to 'o'", () => {
    expect(normalizeRomaji("toukyou")).toBe("tokyo");
  });

  it("normalizes long vowel 'oo' to 'o'", () => {
    expect(normalizeRomaji("doomo")).toBe("domo");
  });

  it("normalizes long vowel 'uu' to 'u'", () => {
    expect(normalizeRomaji("shuumatsu")).toBe("shumatsu");
  });

  it("normalizes n apostrophe", () => {
    expect(normalizeRomaji("an'i")).toBe("ani");
  });

  it("trims whitespace", () => {
    expect(normalizeRomaji("  migi  ")).toBe("migi");
  });
});

describe("romajiMatches", () => {
  it("matches exact romaji", () => {
    expect(romajiMatches("migi", "migi")).toBe(true);
  });

  it("matches case insensitive", () => {
    expect(romajiMatches("MIGI", "migi")).toBe(true);
  });

  it("rejects wrong answer", () => {
    expect(romajiMatches("hidari", "migi")).toBe(false);
  });

  it("matches alternative readings separated by / ", () => {
    expect(romajiMatches("yon", "shi / yon")).toBe(true);
    expect(romajiMatches("shi", "shi / yon")).toBe(true);
  });
});

describe("hiraganaToKatakana", () => {
  it("converts hiragana to katakana", () => {
    expect(hiraganaToKatakana("みぎ")).toBe("ミギ");
    expect(hiraganaToKatakana("てんき")).toBe("テンキ");
  });

  it("leaves non-hiragana unchanged", () => {
    expect(hiraganaToKatakana("ABC")).toBe("ABC");
  });
});

describe("katakanaToHiragana", () => {
  it("converts katakana to hiragana", () => {
    expect(katakanaToHiragana("ミギ")).toBe("みぎ");
  });
});

describe("levenshtein", () => {
  it("returns 0 for identical strings", () => {
    expect(levenshtein("abc", "abc")).toBe(0);
  });

  it("returns 1 for one substitution", () => {
    expect(levenshtein("abc", "axc")).toBe(1);
  });

  it("returns correct distance", () => {
    expect(levenshtein("kitten", "sitting")).toBe(3);
  });
});

describe("kanaMatches", () => {
  it("exact match returns true", () => {
    expect(kanaMatches("みぎ", "みぎ")).toBe(true);
  });

  it("wrong kana returns false for word", () => {
    expect(kanaMatches("ひだり", "みぎ", false)).toBe(false);
  });

  it("normalizes katakana input to hiragana", () => {
    expect(kanaMatches("ミギ", "みぎ")).toBe(true);
  });

  it("allows small tolerance for sentences", () => {
    // One character typo in a long sentence
    const target = "えきはどこですか";
    const input = "えきわどこですか"; // one char wrong
    expect(kanaMatches(input, target, true)).toBe(true);
  });
});
