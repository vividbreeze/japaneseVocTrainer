import type { VocabEntry } from "../types";

export const restaurant: VocabEntry[] = [
  { id: "res_001", topicId: "restaurant", type: "word", japanese: "食べ物", kana: "たべもの", romaji: "tabemono", english: "food", tags: ["n5"], jlptLevel: "N5", partOfSpeech: "noun" },
  { id: "res_002", topicId: "restaurant", type: "word", japanese: "飲み物", kana: "のみもの", romaji: "nomimono", english: "drink / beverage", tags: ["n5"], jlptLevel: "N5", partOfSpeech: "noun" },
  { id: "res_003", topicId: "restaurant", type: "word", japanese: "メニュー", kana: "めにゅー", romaji: "menyu-", english: "menu", tags: ["n4"], jlptLevel: "N4", partOfSpeech: "noun" },
  { id: "res_004", topicId: "restaurant", type: "word", japanese: "注文", kana: "ちゅうもん", romaji: "chuumon", english: "order", tags: ["n4"], jlptLevel: "N4", partOfSpeech: "noun" },
  { id: "res_005", topicId: "restaurant", type: "word", japanese: "おすすめ", kana: "おすすめ", romaji: "osusume", english: "recommendation", tags: ["n4"], jlptLevel: "N4", partOfSpeech: "noun" },
  { id: "res_006", topicId: "restaurant", type: "word", japanese: "お会計", kana: "おかいけい", romaji: "okaikei", english: "bill / check", tags: ["n4"], jlptLevel: "N4", partOfSpeech: "noun" },
  { id: "res_007", topicId: "restaurant", type: "word", japanese: "おいしい", kana: "おいしい", romaji: "oishii", english: "delicious", tags: ["n5"], jlptLevel: "N5", partOfSpeech: "adjective" },
  { id: "res_008", topicId: "restaurant", type: "word", japanese: "辛い", kana: "からい", romaji: "karai", english: "spicy / hot (taste)", tags: ["n5"], jlptLevel: "N5", partOfSpeech: "adjective" },
  { id: "res_009", topicId: "restaurant", type: "word", japanese: "甘い", kana: "あまい", romaji: "amai", english: "sweet", tags: ["n5"], jlptLevel: "N5", partOfSpeech: "adjective" },
  { id: "res_010", topicId: "restaurant", type: "word", japanese: "席", kana: "せき", romaji: "seki", english: "seat", tags: ["n4"], jlptLevel: "N4", partOfSpeech: "noun" },
  { id: "res_011", topicId: "restaurant", type: "word", japanese: "予約", kana: "よやく", romaji: "yoyaku", english: "reservation", tags: ["n4"], jlptLevel: "N4", partOfSpeech: "noun" },
  { id: "res_012", topicId: "restaurant", type: "word", japanese: "アレルギー", kana: "あれるぎー", romaji: "arerugi-", english: "allergy", tags: ["practical"], jlptLevel: null, partOfSpeech: "noun" },
  { id: "res_013", topicId: "restaurant", type: "word", japanese: "箸", kana: "はし", romaji: "hashi", english: "chopsticks", tags: ["n4"], jlptLevel: "N4", partOfSpeech: "noun" },
  { id: "res_014", topicId: "restaurant", type: "word", japanese: "水", kana: "みず", romaji: "mizu", english: "water", tags: ["n5"], jlptLevel: "N5", partOfSpeech: "noun" },
  { id: "res_015", topicId: "restaurant", type: "word", japanese: "ビール", kana: "びーる", romaji: "bi-ru", english: "beer", tags: ["practical"], jlptLevel: null, partOfSpeech: "noun" },
  // Sentences
  { id: "res_s01", topicId: "restaurant", type: "sentence", japanese: "すみません！", kana: "すみません！", romaji: "sumimasen!", english: "Excuse me! (calling a waiter)", tags: ["n5", "expression"], jlptLevel: "N5", partOfSpeech: "expression" },
  { id: "res_s02", topicId: "restaurant", type: "sentence", japanese: "これをください。", kana: "これをください。", romaji: "kore wo kudasai.", english: "I'll have this, please.", tags: ["n5"], jlptLevel: "N5", partOfSpeech: "expression" },
  { id: "res_s03", topicId: "restaurant", type: "sentence", japanese: "お会計をお願いします。", kana: "おかいけいをおねがいします。", romaji: "okaikei wo onegaishimasu.", english: "The bill, please.", tags: ["n4"], jlptLevel: "N4", partOfSpeech: "expression" },
  { id: "res_s04", topicId: "restaurant", type: "sentence", japanese: "二人です。", kana: "ふたりです。", romaji: "futari desu.", english: "There are two of us.", tags: ["n5"], jlptLevel: "N5", partOfSpeech: "expression" },
  { id: "res_s05", topicId: "restaurant", type: "sentence", japanese: "おすすめは何ですか？", kana: "おすすめはなんですか？", romaji: "osusume wa nan desu ka?", english: "What do you recommend?", tags: ["n4"], jlptLevel: "N4", partOfSpeech: "expression" },
];
