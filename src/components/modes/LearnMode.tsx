"use client";

import { useState } from "react";
import { KanaDisplay } from "@/components/vocab/KanaDisplay";
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

  const handleFlip = () => setFlipped((f) => !f);

  const handleRating = (rating: "again" | "hard" | "good" | "easy") => {
    onAdvance(UI_RATING_TO_SM2[rating]);
    setFlipped(false);
  };

  if (isComplete) {
    return <CompletionScreen total={entries.length} correct={correctCount} onBack={onBack} />;
  }

  if (!entry) return null;

  return (
    <div className="flex flex-col gap-6 w-full max-w-xl mx-auto">
      <ProgressBar current={currentIndex} total={entries.length} correct={correctCount} />

      {/* Flip Card */}
      <div className="flip-card w-full min-h-[280px] cursor-pointer" onClick={handleFlip}>
        <div className={`flip-card-inner relative w-full min-h-[280px] ${flipped ? "flipped" : ""}`}>
          {/* Front */}
          <div className="flip-card-front absolute inset-0 bg-[#1a1a2e] border border-[#2a2a4a] rounded-2xl p-8 flex flex-col items-center justify-center gap-4">
            <div className="text-xs text-gray-500 uppercase tracking-wider">
              {entry.partOfSpeech ?? entry.type}
            </div>
            <KanaDisplay
              japanese={entry.japanese}
              kana={entry.kana}
              romaji={entry.romaji}
              displayScript={settings.displayScript}
              showRomaji={settings.showRomaji}
              size="xl"
            />
            <div className="mt-4 text-sm text-gray-500">tap to reveal</div>
          </div>

          {/* Back */}
          <div className="flip-card-back absolute inset-0 bg-[#1e1e38] border border-indigo-500/30 rounded-2xl p-8 flex flex-col items-center justify-center gap-4">
            <KanaDisplay
              japanese={entry.japanese}
              kana={entry.kana}
              romaji={entry.romaji}
              displayScript={settings.displayScript}
              showRomaji={settings.showRomaji}
              size="lg"
            />
            <div className="text-2xl font-semibold text-white mt-2">{entry.english}</div>
            {entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 justify-center">
                {entry.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-xs bg-[#2a2a4a] text-gray-400 px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rating buttons (shown only when flipped) */}
      {flipped ? (
        <div className="grid grid-cols-4 gap-2">
          {(["again", "hard", "good", "easy"] as const).map((rating) => (
            <button
              key={rating}
              onClick={() => handleRating(rating)}
              className={`py-3 px-2 rounded-xl text-sm font-bold transition-colors ${
                rating === "again"
                  ? "bg-red-600/20 text-red-400 hover:bg-red-600/40"
                  : rating === "hard"
                  ? "bg-orange-600/20 text-orange-400 hover:bg-orange-600/40"
                  : rating === "good"
                  ? "bg-green-600/20 text-green-400 hover:bg-green-600/40"
                  : "bg-blue-600/20 text-blue-400 hover:bg-blue-600/40"
              }`}
            >
              {rating.charAt(0).toUpperCase() + rating.slice(1)}
            </button>
          ))}
        </div>
      ) : (
        <button
          onClick={handleFlip}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
        >
          Reveal Answer
        </button>
      )}

      <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-300 text-center">
        ← Back to topic
      </button>
    </div>
  );
}

function CompletionScreen({ total, correct, onBack }: { total: number; correct: number; onBack: () => void }) {
  const pct = Math.round((correct / Math.max(total, 1)) * 100);
  return (
    <div className="flex flex-col items-center gap-6 text-center max-w-sm mx-auto">
      <div className="text-6xl">🎉</div>
      <h2 className="text-2xl font-bold">Session Complete!</h2>
      <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-2xl p-6 w-full">
        <div className="text-4xl font-bold text-indigo-400">{pct}%</div>
        <div className="text-gray-400 mt-1">{correct} / {total} correct</div>
      </div>
      <button
        onClick={onBack}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
      >
        Back to Topics
      </button>
    </div>
  );
}
