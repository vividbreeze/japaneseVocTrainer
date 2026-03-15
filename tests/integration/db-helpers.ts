/**
 * Creates an in-memory SQLite database with all migrations applied
 * and a small fixture of vocabulary data for integration tests.
 */
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import path from "path";
import * as schema from "@db/schema";

export function createTestDb() {
  const sqlite = new Database(":memory:");
  sqlite.pragma("journal_mode = WAL");
  const db = drizzle(sqlite, { schema });

  const migrationsFolder = path.join(process.cwd(), "db", "migrations");
  migrate(db, { migrationsFolder });

  return db;
}

export const testVocab = [
  {
    id: "test_001",
    topicId: "directions",
    type: "word" as const,
    japanese: "右",
    kana: "みぎ",
    romaji: "migi",
    english: "right",
    tags: JSON.stringify(["n5"]),
    jlptLevel: "N5" as const,
    partOfSpeech: "noun",
    createdAt: Date.now(),
  },
  {
    id: "test_002",
    topicId: "directions",
    type: "word" as const,
    japanese: "左",
    kana: "ひだり",
    romaji: "hidari",
    english: "left",
    tags: JSON.stringify(["n5"]),
    jlptLevel: "N5" as const,
    partOfSpeech: "noun",
    createdAt: Date.now(),
  },
  {
    id: "test_003",
    topicId: "weather",
    type: "word" as const,
    japanese: "雨",
    kana: "あめ",
    romaji: "ame",
    english: "rain",
    tags: JSON.stringify(["n5"]),
    jlptLevel: "N5" as const,
    partOfSpeech: "noun",
    createdAt: Date.now(),
  },
];

export async function seedTestDb(db: ReturnType<typeof createTestDb>) {
  await db.insert(schema.vocabEntries).values(testVocab);
  await db.insert(schema.settings).values({
    id: 1,
    displayScript: "hiragana",
    inputMode: "romaji",
    showRomaji: true,
    showEnglish: true,
    cardType: "word",
    topicsEnabled: "[]",
    updatedAt: Date.now(),
  });
}
