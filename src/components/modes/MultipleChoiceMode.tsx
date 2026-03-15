"use client";

import { useState, useEffect } from "react";
import { KanaDisplay } from "@/components/vocab/KanaDisplay";
import { ProgressBar } from "@/components/quiz/ProgressBar";
import { buildChoices } from "@/lib/similarity";
import type { UserSettings } from "@/types/settings";
import type { VocabEntry } from "@/types/vocab";
import type { SessionEntry } from "@/hooks/useSession";

interface MultipleChoiceModeProps {
  entries: SessionEntry[];
  allEntries: VocabEntry[]; // Full pool for distractor selection
  currentIndex: number;
  isComplete: boolean;
  settings: UserSettings;
  onAdvance: (quality: number) => void;
  onBack: () => void;
  correctCount: number;
}

interface Choice {
  entry: VocabEntry;
  isCorrect: boolean;
}

export function MultipleChoiceMode({
  entries,
  allEntries,
  currentIndex,
  isComplete,
  settings,
  onAdvance,
  onBack,
  correctCount,
}: MultipleChoiceModeProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [choices, setChoices] = useState<Choice[]>([]);

  const entry = entries[currentIndex];

  // Build new choices when entry changes
  useEffect(() => {
    if (!entry) return;

    const pool = allEntries.filter((e) => e.type === entry.type);
    const { entries: choiceEntries, correctIndex } = buildChoices(entry, pool);
    setChoices(
      choiceEntries.map((e, i) => ({
        entry: e,
        isCorrect: i === correctIndex,
      }))
    );
    setSelected(null);
  }, [entry?.id, allEntries]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isComplete) {
    return <CompletionScreen total={entries.length} correct={correctCount} onBack={onBack} />;
  }

  if (!entry || choices.length === 0) return null;

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);

    const isCorrect = choices[idx].isCorrect;
    // Quality: correct = 4, wrong = 0
    setTimeout(() => {
      onAdvance(isCorrect ? 4 : 0);
      setSelected(null);
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-xl mx-auto">
      <ProgressBar current={currentIndex} total={entries.length} correct={correctCount} />

      {/* Question */}
      <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-2xl p-8 flex flex-col items-center gap-4">
        <div className="text-xs text-gray-500 uppercase tracking-wider">What does this mean?</div>
        <KanaDisplay
          japanese={entry.japanese}
          kana={entry.kana}
          romaji={entry.romaji}
          displayScript={settings.displayScript}
          showRomaji={settings.showRomaji}
          size="xl"
        />
      </div>

      {/* Choices */}
      <div className="grid grid-cols-1 gap-3">
        {choices.map((choice, idx) => {
          const isSelected = selected === idx;
          const isAnswered = selected !== null;

          let borderColor = "border-[#2a2a4a]";
          let bgColor = "bg-[#1a1a2e]";
          let textColor = "text-white";

          if (isAnswered) {
            if (choice.isCorrect) {
              borderColor = "border-green-500";
              bgColor = "bg-green-900/20";
              textColor = "text-green-300";
            } else if (isSelected) {
              borderColor = "border-red-500";
              bgColor = "bg-red-900/20";
              textColor = "text-red-300";
            } else {
              textColor = "text-gray-500";
            }
          }

          return (
            <button
              key={choice.entry.id}
              onClick={() => handleSelect(idx)}
              disabled={isAnswered}
              className={`w-full p-4 rounded-xl border text-left font-medium transition-all ${bgColor} ${borderColor} ${textColor} ${
                !isAnswered ? "hover:border-indigo-500 hover:bg-[#1e1e38] cursor-pointer" : "cursor-default"
              }`}
            >
              {choice.entry.english}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {selected !== null && (
        <div className={`text-center text-sm font-medium ${choices[selected].isCorrect ? "text-green-400" : "text-red-400"}`}>
          {choices[selected].isCorrect ? "✓ Correct!" : `✗ Wrong — answer: ${entry.english}`}
        </div>
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
      <div className="text-6xl">{pct >= 80 ? "🏆" : pct >= 50 ? "📈" : "💪"}</div>
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
