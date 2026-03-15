import type { VocabEntry } from "../types";

export const directions: VocabEntry[] = [
  // Core N5 words
  { id: "dir_001", topicId: "directions", type: "word", japanese: "右", kana: "みぎ", romaji: "migi", english: "right", tags: ["n5", "direction"], jlptLevel: "N5", partOfSpeech: "noun" },
  { id: "dir_002", topicId: "directions", type: "word", japanese: "左", kana: "ひだり", romaji: "hidari", english: "left", tags: ["n5", "direction"], jlptLevel: "N5", partOfSpeech: "noun" },
  { id: "dir_003", topicId: "directions", type: "word", japanese: "まっすぐ", kana: "まっすぐ", romaji: "massugu", english: "straight ahead", tags: ["n5", "direction"], jlptLevel: "N5", partOfSpeech: "adverb" },
  { id: "dir_004", topicId: "directions", type: "word", japanese: "前", kana: "まえ", romaji: "mae", english: "in front / before", tags: ["n5", "direction"], jlptLevel: "N5", partOfSpeech: "noun" },
  { id: "dir_005", topicId: "directions", type: "word", japanese: "後ろ", kana: "うしろ", romaji: "ushiro", english: "behind / back", tags: ["n5", "direction"], jlptLevel: "N5", partOfSpeech: "noun" },
  { id: "dir_006", topicId: "directions", type: "word", japanese: "近く", kana: "ちかく", romaji: "chikaku", english: "nearby / close", tags: ["n5", "location"], jlptLevel: "N5", partOfSpeech: "noun" },
  { id: "dir_007", topicId: "directions", type: "word", japanese: "遠い", kana: "とおい", romaji: "tooi", english: "far", tags: ["n5", "location"], jlptLevel: "N5", partOfSpeech: "adjective" },
  { id: "dir_008", topicId: "directions", type: "word", japanese: "交差点", kana: "こうさてん", romaji: "kousaten", english: "intersection / crossroads", tags: ["n4", "location"], jlptLevel: "N4", partOfSpeech: "noun" },
  { id: "dir_009", topicId: "directions", type: "word", japanese: "角", kana: "かど", romaji: "kado", english: "corner", tags: ["n4", "location"], jlptLevel: "N4", partOfSpeech: "noun" },
  { id: "dir_010", topicId: "directions", type: "word", japanese: "道", kana: "みち", romaji: "michi", english: "road / way / path", tags: ["n5", "location"], jlptLevel: "N5", partOfSpeech: "noun" },
  { id: "dir_011", topicId: "directions", type: "word", japanese: "橋", kana: "はし", romaji: "hashi", english: "bridge", tags: ["n4", "location"], jlptLevel: "N4", partOfSpeech: "noun" },
  { id: "dir_012", topicId: "directions", type: "word", japanese: "信号", kana: "しんごう", romaji: "shingou", english: "traffic light", tags: ["n4", "location"], jlptLevel: "N4", partOfSpeech: "noun" },
  { id: "dir_013", topicId: "directions", type: "word", japanese: "地図", kana: "ちず", romaji: "chizu", english: "map", tags: ["n4"], jlptLevel: "N4", partOfSpeech: "noun" },
  { id: "dir_014", topicId: "directions", type: "word", japanese: "曲がる", kana: "まがる", romaji: "magaru", english: "to turn", tags: ["n4", "verb"], jlptLevel: "N4", partOfSpeech: "verb" },
  { id: "dir_015", topicId: "directions", type: "word", japanese: "渡る", kana: "わたる", romaji: "wataru", english: "to cross (a road/bridge)", tags: ["n4", "verb"], jlptLevel: "N4", partOfSpeech: "verb" },
  // Sentences
  { id: "dir_s01", topicId: "directions", type: "sentence", japanese: "駅はどこですか？", kana: "えきはどこですか？", romaji: "eki wa doko desu ka?", english: "Where is the station?", tags: ["question", "n5"], jlptLevel: "N5", partOfSpeech: "expression" },
  { id: "dir_s02", topicId: "directions", type: "sentence", japanese: "右に曲がってください。", kana: "みぎにまがってください。", romaji: "migi ni magatte kudasai.", english: "Please turn right.", tags: ["direction", "n4"], jlptLevel: "N4", partOfSpeech: "expression" },
  { id: "dir_s03", topicId: "directions", type: "sentence", japanese: "まっすぐ行ってください。", kana: "まっすぐいってください。", romaji: "massugu itte kudasai.", english: "Please go straight ahead.", tags: ["direction", "n5"], jlptLevel: "N5", partOfSpeech: "expression" },
  { id: "dir_s04", topicId: "directions", type: "sentence", japanese: "地図を見せてください。", kana: "ちずをみせてください。", romaji: "chizu wo misete kudasai.", english: "Please show me a map.", tags: ["n4"], jlptLevel: "N4", partOfSpeech: "expression" },
  { id: "dir_s05", topicId: "directions", type: "sentence", japanese: "信号を渡ってください。", kana: "しんごうをわたってください。", romaji: "shingou wo watatte kudasai.", english: "Please cross at the traffic light.", tags: ["n4"], jlptLevel: "N4", partOfSpeech: "expression" },
];
