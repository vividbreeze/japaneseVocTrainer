"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { MultipleChoiceMode } from "@/components/modes/MultipleChoiceMode";
import { useSession } from "@/hooks/useSession";
import { useSettings } from "@/hooks/useSettings";
import { useVocab } from "@/hooks/useVocab";
import { SettingsPanel } from "@/components/settings/SettingsPanel";
import type { TopicId } from "@/types/vocab";
import type { CardType } from "@/types/settings";

export default function MultipleChoicePage({
  params,
  searchParams,
}: {
  params: Promise<{ topicId: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { topicId } = use(params);
  const { type } = use(searchParams);
  const router = useRouter();
  const { settings, updateSettings, isLoading: settingsLoading } = useSettings();
  const [correctCount, setCorrectCount] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const cardType: CardType = (type as CardType) ?? settings?.cardType ?? "word";

  const { entries: sessionEntries, currentIndex, isComplete, isLoading, advance, dueCount, newCount, total } =
    useSession(topicId as TopicId, "multiple-choice", cardType, settings?.sessionSize ?? 20);

  // Load full topic vocab for distractor pool
  const { entries: allEntries } = useVocab(topicId as TopicId, cardType);

  if (settingsLoading || isLoading || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400 animate-pulse">Loading session...</div>
      </div>
    );
  }

  const handleAdvance = (quality: number) => {
    if (quality >= 3) setCorrectCount((c) => c + 1);
    advance(quality);
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 bg-[#0f0f1a]/90 backdrop-blur-sm border-b border-[#2a2a4a]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            ← Back
          </button>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-400">
              {dueCount} fällig · {newCount} neu · {total} gesamt
            </div>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-lg hover:bg-[#2a2a4a] transition-colors text-gray-300 hover:text-white text-xl"
              aria-label="Einstellungen"
            >
              ⚙️
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <MultipleChoiceMode
          entries={sessionEntries}
          allEntries={allEntries}
          currentIndex={currentIndex}
          isComplete={isComplete}
          settings={settings}
          onAdvance={handleAdvance}
          onBack={() => router.back()}
          correctCount={correctCount}
        />
      </main>

      {showSettings && settings && (
        <SettingsPanel
          settings={settings}
          onUpdate={updateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
