import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const vocabEntries = sqliteTable("vocab_entries", {
  id: text("id").primaryKey(),
  topicId: text("topic_id").notNull(),
  type: text("type", { enum: ["word", "sentence"] }).notNull(),
  japanese: text("japanese").notNull(),
  kana: text("kana").notNull(),
  romaji: text("romaji").notNull(),
  english: text("english").notNull(),
  tags: text("tags").notNull().default("[]"), // JSON array
  jlptLevel: text("jlpt_level"),
  partOfSpeech: text("part_of_speech"),
  createdAt: integer("created_at").notNull(),
});

export const progress = sqliteTable("progress", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  vocabId: text("vocab_id").notNull().unique(),
  easinessFactor: real("easiness_factor").notNull().default(2.5),
  interval: integer("interval").notNull().default(0),
  repetitions: integer("repetitions").notNull().default(0),
  dueDate: integer("due_date").notNull(),
  lastReviewed: integer("last_reviewed"),
  correctCount: integer("correct_count").notNull().default(0),
  incorrectCount: integer("incorrect_count").notNull().default(0),
  createdAt: integer("created_at").notNull(),
});

export const settings = sqliteTable("settings", {
  id: integer("id").primaryKey().default(1),
  displayScript: text("display_script", {
    enum: ["hiragana", "katakana", "kanji", "all"],
  })
    .notNull()
    .default("hiragana"),
  inputMode: text("input_mode", { enum: ["romaji", "kana"] })
    .notNull()
    .default("romaji"),
  showRomaji: integer("show_romaji", { mode: "boolean" }).notNull().default(true),
  showEnglish: integer("show_english", { mode: "boolean" }).notNull().default(true),
  cardType: text("card_type", { enum: ["word", "sentence"] })
    .notNull()
    .default("word"),
  topicsEnabled: text("topics_enabled").notNull().default("[]"), // JSON array
  showPartOfSpeech: integer("show_part_of_speech", { mode: "boolean" }).notNull().default(false),
  sessionSize: integer("session_size").notNull().default(20), // 0 = all
  updatedAt: integer("updated_at").notNull(),
});

export const studySessions = sqliteTable("study_sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  startedAt: integer("started_at").notNull(),
  endedAt: integer("ended_at"),
  topicId: text("topic_id"),
  mode: text("mode", {
    enum: ["learn", "multiple-choice", "free-input"],
  }),
  cardsReviewed: integer("cards_reviewed").notNull().default(0),
  correctCount: integer("correct_count").notNull().default(0),
});
