import type { VocabEntry } from "../types";

export const weather: VocabEntry[] = [
  { id: "wea_001", topicId: "weather", type: "word", japanese: "天気", kana: "てんき", romaji: "tenki", english: "weather", tags: ["n5"], jlptLevel: "N5", partOfSpeech: "noun" },
  { id: "wea_002", topicId: "weather", type: "word", japanese: "晴れ", kana: "はれ", romaji: "hare", english: "sunny / clear weather", tags: ["n5"], jlptLevel: "N5", partOfSpeech: "noun" },
  { id: "wea_003", topicId: "weather", type: "word", japanese: "雨", kana: "あめ", romaji: "ame", english: "rain", tags: ["n5"], jlptLevel: "N5", partOfSpeech: "noun" },
  { id: "wea_004", topicId: "weather", type: "word", japanese: "雪", kana: "ゆき", romaji: "yuki", english: "snow", tags: ["n5"], jlptLevel: "N5", partOfSpeech: "noun" },
  { id: "wea_005", topicId: "weather", type: "word", japanese: "曇り", kana: "くもり", romaji: "kumori", english: "cloudy", tags: ["n5"], jlptLevel: "N5", partOfSpeech: "noun" },
  { id: "wea_006", topicId: "weather", type: "word", japanese: "風", kana: "かぜ", romaji: "kaze", english: "wind", tags: ["n5"], jlptLevel: "N5", partOfSpeech: "noun" },
  { id: "wea_007", topicId: "weather", type: "word", japanese: "暑い", kana: "あつい", romaji: "atsui", english: "hot (weather)", tags: ["n5"], jlptLevel: "N5", partOfSpeech: "adjective" },
  { id: "wea_008", topicId: "weather", type: "word", japanese: "寒い", kana: "さむい", romaji: "samui", english: "cold (weather)", tags: ["n5"], jlptLevel: "N5", partOfSpeech: "adjective" },
  { id: "wea_009", topicId: "weather", type: "word", japanese: "涼しい", kana: "すずしい", romaji: "suzushii", english: "cool / refreshing (weather)", tags: ["n5"], jlptLevel: "N5", partOfSpeech: "adjective" },
  { id: "wea_010", topicId: "weather", type: "word", japanese: "暖かい", kana: "あたたかい", romaji: "atatakai", english: "warm", tags: ["n5"], jlptLevel: "N5", partOfSpeech: "adjective" },
  { id: "wea_011", topicId: "weather", type: "word", japanese: "台風", kana: "たいふう", romaji: "taifuu", english: "typhoon", tags: ["n4"], jlptLevel: "N4", partOfSpeech: "noun" },
  { id: "wea_012", topicId: "weather", type: "word", japanese: "雷", kana: "かみなり", romaji: "kaminari", english: "thunder / lightning", tags: ["n4"], jlptLevel: "N4", partOfSpeech: "noun" },
  { id: "wea_013", topicId: "weather", type: "word", japanese: "傘", kana: "かさ", romaji: "kasa", english: "umbrella", tags: ["n5"], jlptLevel: "N5", partOfSpeech: "noun" },
  { id: "wea_014", topicId: "weather", type: "word", japanese: "気温", kana: "きおん", romaji: "kion", english: "temperature (air)", tags: ["n4"], jlptLevel: "N4", partOfSpeech: "noun" },
  { id: "wea_015", topicId: "weather", type: "word", japanese: "湿度", kana: "しつど", romaji: "shitsudo", english: "humidity", tags: ["n3"], jlptLevel: "N3", partOfSpeech: "noun" },
  // Sentences
  { id: "wea_s01", topicId: "weather", type: "sentence", japanese: "今日は晴れですか？", kana: "きょうははれですか？", romaji: "kyou wa hare desu ka?", english: "Is it sunny today?", tags: ["n5"], jlptLevel: "N5", partOfSpeech: "expression" },
  { id: "wea_s02", topicId: "weather", type: "sentence", japanese: "雨が降っています。", kana: "あめがふっています。", romaji: "ame ga futte imasu.", english: "It is raining.", tags: ["n5"], jlptLevel: "N5", partOfSpeech: "expression" },
  { id: "wea_s03", topicId: "weather", type: "sentence", japanese: "傘を持って行ってください。", kana: "かさをもっていってください。", romaji: "kasa wo motte itte kudasai.", english: "Please take an umbrella with you.", tags: ["n4"], jlptLevel: "N4", partOfSpeech: "expression" },
];
