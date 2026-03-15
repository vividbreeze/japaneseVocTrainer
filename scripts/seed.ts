/**
 * Seed script: runs migrations and loads vocabulary data into SQLite.
 * Run with: npm run db:seed
 */
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { eq } from "drizzle-orm";
import path from "path";
import fs from "fs";

import * as schema from "../db/schema";
import { ALL_VOCAB } from "../data/index";

const DB_PATH = process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "vocab.db");
const MIGRATIONS_PATH = path.join(process.cwd(), "db", "migrations");

async function seed() {
  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  console.log(`📦 Database: ${DB_PATH}`);
  const sqlite = new Database(DB_PATH);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  const db = drizzle(sqlite, { schema });

  // 1. Run migrations
  console.log("🔄 Running migrations...");
  migrate(db, { migrationsFolder: MIGRATIONS_PATH });
  console.log("✓ Migrations done");

  // 2. Seed vocab
  console.log("📚 Seeding vocabulary...");
  let inserted = 0;
  let skipped = 0;

  for (const entry of ALL_VOCAB) {
    const existing = await db
      .select({ id: schema.vocabEntries.id })
      .from(schema.vocabEntries)
      .where(eq(schema.vocabEntries.id, entry.id))
      .limit(1);

    if (existing.length > 0) {
      // Update existing entry (allows vocabulary updates)
      await db
        .update(schema.vocabEntries)
        .set({
          japanese: entry.japanese,
          kana: entry.kana,
          romaji: entry.romaji,
          english: entry.english,
          tags: JSON.stringify(entry.tags),
          jlptLevel: entry.jlptLevel ?? null,
          partOfSpeech: entry.partOfSpeech ?? null,
        })
        .where(eq(schema.vocabEntries.id, entry.id));
      skipped++;
    } else {
      await db.insert(schema.vocabEntries).values({
        id: entry.id,
        topicId: entry.topicId,
        type: entry.type,
        japanese: entry.japanese,
        kana: entry.kana,
        romaji: entry.romaji,
        english: entry.english,
        tags: JSON.stringify(entry.tags),
        jlptLevel: entry.jlptLevel ?? null,
        partOfSpeech: entry.partOfSpeech ?? null,
        createdAt: Date.now(),
      });
      inserted++;
    }
  }

  console.log(`✓ Vocab: ${inserted} inserted, ${skipped} updated`);

  // 3. Seed default settings (only if not exists)
  const existingSettings = await db
    .select()
    .from(schema.settings)
    .where(eq(schema.settings.id, 1))
    .limit(1);

  if (existingSettings.length === 0) {
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
    console.log("✓ Default settings created");
  } else {
    console.log("✓ Settings already exist, skipping");
  }

  sqlite.close();
  console.log("✅ Seed complete!");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
