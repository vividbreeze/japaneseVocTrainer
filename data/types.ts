export type TopicId =
  | "directions"
  | "restaurant"
  | "shop"
  | "meeting-people"
  | "museum"
  | "hotel"
  | "airport"
  | "train-station"
  | "clothing"
  | "doctor-hospital"
  | "small-talk"
  | "numbers-counters"
  | "time-date"
  | "family"
  | "emotions"
  | "weather";

export type EntryType = "word" | "sentence";
export type PartOfSpeech =
  | "noun"
  | "verb"
  | "adjective"
  | "adverb"
  | "particle"
  | "expression"
  | "counter"
  | "number"
  | "pronoun"
  | "conjunction"
  | null;

export interface VocabEntry {
  id: string;
  topicId: TopicId;
  type: EntryType;
  japanese: string;
  kana: string;
  romaji: string;
  english: string;
  tags: string[];
  jlptLevel: "N5" | "N4" | "N3" | null;
  partOfSpeech: PartOfSpeech;
}
