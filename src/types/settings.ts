import type { TopicId } from "./vocab";

export type DisplayScript = "hiragana" | "katakana" | "kanji" | "all";
export type InputMode = "romaji" | "kana";
export type CardType = "word" | "sentence";

export interface UserSettings {
  id: number;
  displayScript: DisplayScript;
  inputMode: InputMode;
  showRomaji: boolean;
  showEnglish: boolean;
  cardType: CardType;
  topicsEnabled: TopicId[];
  updatedAt: number;
}

export const DEFAULT_SETTINGS: Omit<UserSettings, "id" | "updatedAt"> = {
  displayScript: "hiragana",
  inputMode: "romaji",
  showRomaji: true,
  showEnglish: true,
  cardType: "word",
  topicsEnabled: [],
};
