"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { FreeInputMode } from "@/components/modes/FreeInputMode";
import { useSession } from "@/hooks/useSession";
import { useSettings } from "@/hooks/useSettings";
import type { TopicId } from "@/types/vocab";
import type { CardType } from "@/types/settings";

export default function FreeInputPage({
  params,
  searchParams,
}: {
  params: Promise<{ topicId: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { topicId } = use(params);
  const { type } = use(searchParams);
  const router = useRouter();
  const { settings, isLoading: settingsLoading } = useSettings();
  const [correctCount, setCorrectCount] = useState(0);

  const cardType: CardType = (type as CardType) ?? settings?.cardType ?? "word";

  const { entries: sessionEntries, currentIndex, isComplete, isLoading, advance, dueCount, newCount, total } =
    useSession(topicId as TopicId, "free-input", cardType);

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
          <div className="text-sm text-gray-400">
            {dueCount} due · {newCount} new · {total} total
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <FreeInputMode
          entries={sessionEntries}
          currentIndex={currentIndex}
          isComplete={isComplete}
          settings={settings}
          onAdvance={handleAdvance}
          onBack={() => router.back()}
          correctCount={correctCount}
        />
      </main>
    </div>
  );
}
