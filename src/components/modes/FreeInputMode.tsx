"use client";

import { useState, useRef, useEffect } from "react";
import { KanaDisplay } from "@/components/vocab/KanaDisplay";
import { PartOfSpeechBadge } from "@/components/vocab/PartOfSpeechBadge";
import { ProgressBar } from "@/components/quiz/ProgressBar";
import { normalizeRomaji, romajiMatches, kanaMatches } from "@/lib/romaji";
import type { UserSettings } from "@/types/settings";
import type { SessionEntry } from "@/hooks/useSession";

interface FreeInputModeProps {
  entries: SessionEntry[];
  currentIndex: number;
  isComplete: boolean;
  settings: UserSettings;
  onAdvance: (quality: number) => void;
  onBack: () => void;
  correctCount: number;
}

type FeedbackState = "idle" | "correct" | "wrong";

export function FreeInputMode({
  entries,
  currentIndex,
  isComplete,
  settings,
  onAdvance,
  onBack,
  correctCount,
}: FreeInputModeProps) {
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState>("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  const entry = entries[0]; // queue: current card is always first

  // Reset and focus when a new card appears (entry ID changes)
  useEffect(() => {
    setInput("");
    setFeedback("idle");
    inputRef.current?.focus();
  }, [entry?.id]);

  // Re-focus whenever feedback clears back to idle (covers same-card repeats)
  useEffect(() => {
    if (feedback === "idle") {
      inputRef.current?.focus();
    }
  }, [feedback]);

  if (isComplete) {
    return <CompletionScreen total={correctCount} onBack={onBack} />;
  }

  if (!entry) return null;

  const checkAnswer = (value: string): boolean => {
    if (settings.inputMode === "romaji") {
      return romajiMatches(value, entry.romaji);
    } else {
      return kanaMatches(value, entry.kana, entry.type === "sentence");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || feedback !== "idle") return;

    const isCorrect = checkAnswer(input.trim());
    setFeedback(isCorrect ? "correct" : "wrong");

    setTimeout(() => {
      onAdvance(isCorrect ? 4 : 0);
      setInput("");
      setFeedback("idle");
      // focus is set by the feedback-idle effect above, but belt-and-suspenders:
      requestAnimationFrame(() => inputRef.current?.focus());
    }, 1500);
  };

  const handleSkip = () => {
    onAdvance(0);
    setInput("");
    setFeedback("idle");
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const placeholder =
    settings.inputMode === "romaji"
      ? "Type in romaji..."
      : "Type in kana...";

  return (
    <div className="flex flex-col gap-6 w-full max-w-xl mx-auto">
      <ProgressBar current={correctCount} total={entries.length + correctCount} correct={correctCount} />

      {/* Prompt: show English, ask for Japanese */}
      <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-2xl p-8 flex flex-col items-center gap-4">
        <div className="text-xs text-gray-500 uppercase tracking-wider">Wie sagt man...</div>
        <div className="text-3xl font-bold text-white text-center">{entry.english}</div>
        {settings.showPartOfSpeech && entry.partOfSpeech && (
          <PartOfSpeechBadge pos={entry.partOfSpeech} />
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          disabled={feedback !== "idle"}
          className={`w-full py-4 px-5 text-xl text-center rounded-xl border transition-colors outline-none font-mono ${
            feedback === "correct"
              ? "border-green-500 bg-green-900/20 text-green-300"
              : feedback === "wrong"
              ? "border-red-500 bg-red-900/20 text-red-300"
              : "border-[#2a2a4a] bg-[#1a1a2e] text-white focus:border-indigo-500"
          } ${settings.inputMode === "kana" ? "japanese" : ""}`}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          data-testid="free-input-field"
        />

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={handleSkip}
            disabled={feedback !== "idle"}
            className="py-3 px-4 rounded-xl text-sm font-medium bg-[#2a2a4a] text-gray-400 hover:bg-[#3a3a5a] disabled:opacity-50"
          >
            Skip
          </button>
          <button
            type="submit"
            disabled={!input.trim() || feedback !== "idle"}
            className="col-span-2 py-3 px-4 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Check
          </button>
        </div>
      </form>

      {/* Feedback display */}
      {feedback !== "idle" && (
        <div className={`bg-[#1a1a2e] border rounded-xl p-4 space-y-2 ${
          feedback === "correct" ? "border-green-500/30" : "border-red-500/30"
        }`}>
          <div className={`text-center font-bold ${feedback === "correct" ? "text-green-400" : "text-red-400"}`}>
            {feedback === "correct" ? "✓ Correct!" : "✗ Wrong answer"}
          </div>
          <div className="flex flex-col items-center gap-1">
            <KanaDisplay
              japanese={entry.japanese}
              kana={entry.kana}
              romaji={entry.romaji}
              displayScript={settings.displayScript}
              showRomaji={true}
              size="md"
            />
            {feedback === "wrong" && (
              <div className="text-sm text-gray-400 mt-1">Your answer: {input}</div>
            )}
          </div>
        </div>
      )}

      <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-300 text-center">
        ← Back to topic
      </button>
    </div>
  );
}

function CompletionScreen({ total, onBack }: { total: number; onBack: () => void }) {
  return (
    <div className="flex flex-col items-center gap-6 text-center max-w-sm mx-auto">
      <div className="text-6xl">🌸</div>
      <h2 className="text-2xl font-bold">Alles gelernt!</h2>
      <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-2xl p-6 w-full space-y-2">
        <div className="text-4xl font-bold text-green-400">{total}</div>
        <div className="text-gray-400">Karten gemeistert</div>
        <div className="text-sm text-indigo-300 mt-2">
          Alle Wörter korrekt eingegeben — ausgezeichnet!
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
