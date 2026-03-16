"use client";

import type { PartOfSpeech } from "@/types/vocab";

const POS_LABELS: Record<NonNullable<PartOfSpeech>, string> = {
  noun:        "Substantiv",
  verb:        "Verb",
  adjective:   "Adjektiv",
  adverb:      "Adverb",
  particle:    "Partikel",
  expression:  "Ausdruck",
  counter:     "Zählwort",
  number:      "Zahl",
  pronoun:     "Pronomen",
  conjunction: "Konjunktion",
};

const POS_COLORS: Record<NonNullable<PartOfSpeech>, string> = {
  noun:        "bg-blue-900/30 text-blue-300 border-blue-700/30",
  verb:        "bg-green-900/30 text-green-300 border-green-700/30",
  adjective:   "bg-orange-900/30 text-orange-300 border-orange-700/30",
  adverb:      "bg-yellow-900/30 text-yellow-300 border-yellow-700/30",
  particle:    "bg-purple-900/30 text-purple-300 border-purple-700/30",
  expression:  "bg-pink-900/30 text-pink-300 border-pink-700/30",
  counter:     "bg-cyan-900/30 text-cyan-300 border-cyan-700/30",
  number:      "bg-cyan-900/30 text-cyan-300 border-cyan-700/30",
  pronoun:     "bg-indigo-900/30 text-indigo-300 border-indigo-700/30",
  conjunction: "bg-rose-900/30 text-rose-300 border-rose-700/30",
};

export function PartOfSpeechBadge({ pos }: { pos: PartOfSpeech }) {
  if (!pos) return null;
  return (
    <span
      className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full border ${POS_COLORS[pos]}`}
    >
      {POS_LABELS[pos]}
    </span>
  );
}
