# Japanese Vocabulary Trainer 🇯🇵

A responsive web app for learning Japanese vocabulary with **spaced repetition** (SM-2 algorithm). Built with Next.js 15, TypeScript, SQLite, and Docker.

## Features

- **321+ vocabulary entries** across 16 topics (JLPT N5/N4 + practical phrases)
- **3 learning modes**: Flashcards, Multiple Choice, Free Input
- **Spaced Repetition (SM-2)**: Less-known words appear more frequently
- **Romaji / Kana toggle**: Display and input in romaji or kana
- **4 display scripts**: Hiragana, Katakana, Kanji, or All
- **Words + Sentences**: Switch between single words and full phrases
- **Persistent progress**: Stored in SQLite, synced across browsers
- **Responsive**: Works on mobile, tablet, and desktop

## Topics

Directions, Restaurant, Shopping, Meeting People, Museum, Hotel, Airport,
Train Station, Clothing, Doctor/Hospital, Small Talk, Numbers & Counters,
Time & Date, Family, Emotions, Weather

## Quick Start

```bash
git clone https://github.com/vividbreeze/japaneseVocTrainer.git
cd japaneseVocTrainer
npm install
npm run db:seed     # run migrations + seed vocabulary
npm run dev         # → http://localhost:3001
```

## Docker (Production)

```bash
docker-compose up -d    # → http://localhost:3000
```

Progress is stored in a Docker volume and survives restarts.

## Docker (Development)

```bash
docker-compose -f docker-compose.dev.yml up
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server (port 3001) |
| `npm run build` | Production build |
| `npm run db:seed` | Migrate + seed DB |
| `npm test` | Unit + integration tests |
| `npm run test:coverage` | Coverage report |
| `npm run test:e2e` | Playwright E2E tests |

## Adding Vocabulary

Edit `data/topics/<topic>.ts`, then run `npm run db:seed`. The script upserts — existing user progress is preserved.

```typescript
{
  id: "dir_001",
  topicId: "directions",
  type: "word",
  japanese: "右",
  kana: "みぎ",
  romaji: "migi",
  english: "right",
  tags: ["n5"],
  jlptLevel: "N5",
  partOfSpeech: "noun",
}
```

## Spaced Repetition (SM-2)

Rate each card: **Again** / **Hard** / **Good** / **Easy**. The algorithm calculates the next review date based on your performance. Cards you struggle with appear more often.

## Settings

Settings persist across all browsers (stored in DB):
- Display script: Hiragana / Katakana / Kanji / All
- Input mode: Romaji / Kana
- Card type: Words / Sentences
- Show/hide Romaji hints

## Tech Stack

Next.js 15 · TypeScript · SQLite (better-sqlite3) · Drizzle ORM · Tailwind CSS v4 · Vitest · Playwright · Docker
