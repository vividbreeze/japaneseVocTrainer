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
  /** Stable unique ID, e.g. "directions_001" */
  id: string;
  topicId: TopicId;
  type: EntryType;
  /** Primary Japanese form (kanji if available, otherwise hiragana) */
  japanese: string;
  /** Reading in hiragana */
  kana: string;
  /** Hepburn romaji (pre-computed) */
  romaji: string;
  /** English translation */
  english: string;
  tags: string[];
  jlptLevel: "N5" | "N4" | "N3" | null;
  partOfSpeech: PartOfSpeech;
}

export interface Topic {
  id: TopicId;
  name: string;
  nameJa: string;
  emoji: string;
  entries: VocabEntry[];
}

export const TOPIC_META: Record<TopicId, { name: string; nameJa: string; emoji: string }> = {
  directions: { name: "Directions", nameJa: "道の聞き方", emoji: "🗺️" },
  restaurant: { name: "Restaurant", nameJa: "レストラン", emoji: "🍜" },
  shop: { name: "Shopping", nameJa: "お店", emoji: "🛍️" },
  "meeting-people": { name: "Meeting People", nameJa: "自己紹介", emoji: "🤝" },
  museum: { name: "Museum", nameJa: "博物館", emoji: "🏛️" },
  hotel: { name: "Hotel", nameJa: "ホテル", emoji: "🏨" },
  airport: { name: "Airport", nameJa: "空港", emoji: "✈️" },
  "train-station": { name: "Train Station", nameJa: "駅", emoji: "🚉" },
  clothing: { name: "Clothing", nameJa: "服", emoji: "👕" },
  "doctor-hospital": { name: "Doctor / Hospital", nameJa: "病院", emoji: "🏥" },
  "small-talk": { name: "Small Talk", nameJa: "雑談", emoji: "💬" },
  "numbers-counters": { name: "Numbers & Counters", nameJa: "数字・助数詞", emoji: "🔢" },
  "time-date": { name: "Time & Date", nameJa: "時間・日付", emoji: "🕐" },
  family: { name: "Family", nameJa: "家族", emoji: "👨‍👩‍👧‍👦" },
  emotions: { name: "Emotions", nameJa: "感情", emoji: "😊" },
  weather: { name: "Weather", nameJa: "天気", emoji: "🌤️" },
};
