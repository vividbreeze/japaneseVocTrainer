"use client";

import { useState } from "react";
import { KanaDisplay } from "@/components/vocab/KanaDisplay";
import { PartOfSpeechBadge } from "@/components/vocab/PartOfSpeechBadge";
import { ProgressBar } from "@/components/quiz/ProgressBar";
import type { UserSettings } from "@/types/settings";
import type { SessionEntry } from "@/hooks/useSession";
import { UI_RATING_TO_SM2 } from "@/types/progress";

interface LearnModeProps {
  entries: SessionEntry[];
  currentIndex: number;
  isComplete: boolean;
  settings: UserSettings;
  onAdvance: (quality?: number) => void;
  onBack: () => void;
  correctCount: number;
}

export function LearnMode({
  entries,
  currentIndex,
  isComplete,
  settings,
  onAdvance,
  onBack,
  correctCount,
}: LearnModeProps) {
  const [flipped, setFlipped] = useState(false);

  const entry = entries[currentIndex];

  const handleRating = (rating: "again" | "hard" | "good" | "easy") => {
    onAdvance(UI_RATING_TO_SM2[rating]);
    setFlipped(false);
  };

  if (isComplete) {
    return <CompletionScreen total={correctCount} onBack={onBack} />;
  }

  if (!entry) return null;

  return (
    <div className="flex flex-col gap-6 w-full max-w-xl mx-auto">
      <ProgressBar current={correctCount} total={entries.length + correctCount} correct={correctCount} />

      {!flipped ? (
        /* FRONT: Japanese word, tap to reveal */
        <button
          onClick={() => setFlipped(true)}
          className="w-full min-h-[280px] bg-[#1a1a2e] border-2 border-[#2a2a4a] hover:border-indigo-500/50 rounded-2xl p-8 flex flex-col items-center justify-center gap-5 transition-colors cursor-pointer"
        >
          {settings.showPartOfSpeech && entry.partOfSpeech && (
            <PartOfSpeechBadge pos={entry.partOfSpeech} />
          )}

          <KanaDisplay
            japanese={entry.japanese}
            kana={entry.kana}
            romaji={entry.romaji}
            displayScript={settings.displayScript}
            showRomaji={settings.showRomaji}
            size="xl"
          />

          <div className="text-sm text-indigo-400/70 mt-2">tippen zum Aufdecken →</div>
        </button>
      ) : (
        /* BACK: Japanese + English translation */
        <div className="w-full min-h-[280px] bg-[#1e1e38] border-2 border-indigo-500/40 rounded-2xl p-8 flex flex-col items-center justify-center gap-5">
          <KanaDisplay
            japanese={entry.japanese}
            kana={entry.kana}
            romaji={entry.romaji}
            displayScript={settings.displayScript}
            showRomaji={true}
            size="lg"
          />

          <div className="w-full h-px bg-indigo-800/40" />

          <div className="text-2xl font-bold text-white text-center">{entry.english}</div>

          <div className="flex flex-wrap gap-2 justify-center">
            {settings.showPartOfSpeech && entry.partOfSpeech && (
              <PartOfSpeechBadge pos={entry.partOfSpeech} />
            )}
            {entry.jlptLevel && (
              <span className="text-xs bg-indigo-600/30 text-indigo-300 px-2 py-0.5 rounded-full font-medium">
                {entry.jlptLevel}
              </span>
            )}
            {entry.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-xs bg-[#2a2a4a] text-gray-400 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {flipped ? (
        <div className="space-y-3">
          <p className="text-center text-xs text-gray-500 uppercase tracking-wider">Wie gut wusstest du es?</p>
          <div className="grid grid-cols-4 gap-2">
            {(
              [
                { rating: "again", label: "Nochmal", color: "bg-red-600/20 text-red-400 hover:bg-red-600/40 border border-red-800/30" },
                { rating: "hard",  label: "Schwer",  color: "bg-orange-600/20 text-orange-400 hover:bg-orange-600/40 border border-orange-800/30" },
                { rating: "good",  label: "Gut",     color: "bg-green-600/20 text-green-400 hover:bg-green-600/40 border border-green-800/30" },
                { rating: "easy",  label: "Leicht",  color: "bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 border border-blue-800/30" },
              ] as const
            ).map(({ rating, label, color }) => (
              <button
                key={rating}
                onClick={() => handleRating(rating)}
                className={`py-3 px-2 rounded-xl text-sm font-bold transition-colors ${color}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setFlipped(true)}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-lg transition-colors"
        >
          Antwort zeigen
        </button>
      )}

      <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-300 text-center py-2">
        ← Zurück zum Thema
      </button>
    </div>
  );
}

function CompletionScreen({ total, onBack }: { total: number; onBack: () => void }) {
  return (
    <div className="flex flex-col items-center gap-6 text-center max-w-sm mx-auto">
      <div className="text-6xl">🎉</div>
      <h2 className="text-2xl font-bold">Alles gelernt!</h2>
      <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-2xl p-6 w-full space-y-2">
        <div className="text-4xl font-bold text-green-400">{total}</div>
        <div className="text-gray-400">Karten gemeistert</div>
        <div className="text-sm text-indigo-300 mt-2">
          Alle Karten wurden mindestens einmal mit „Gut" oder „Leicht" bewertet.
        </div>
      </div>
      <button
        onClick={onBack}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
      >
        Zurück zu den Themen
      </button>
    </div>
  );
}
