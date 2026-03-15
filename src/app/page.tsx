"use client";

import { useState } from "react";
import { TopicGrid } from "@/components/layout/TopicGrid";
import { SettingsPanel } from "@/components/settings/SettingsPanel";
import { useSettings } from "@/hooks/useSettings";

export default function HomePage() {
  const { settings, updateSettings, isLoading } = useSettings();
  const [showSettings, setShowSettings] = useState(false);

  if (isLoading || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400 animate-pulse">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0f0f1a]/90 backdrop-blur-sm border-b border-[#2a2a4a]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇯🇵</span>
            <div>
              <div className="font-bold text-sm sm:text-base">Japanese Vocab Trainer</div>
              <div className="japanese text-xs text-gray-400">日本語ボキャブラリー</div>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-lg hover:bg-[#2a2a4a] transition-colors text-gray-300 hover:text-white text-xl"
            aria-label="Open settings"
          >
            ⚙️
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Choose a Topic</h1>
          <p className="text-gray-400 text-sm">
            {settings.cardType === "word" ? "Words" : "Sentences"} •{" "}
            {settings.displayScript} script •{" "}
            {settings.inputMode} input
          </p>
        </div>

        <TopicGrid />
      </main>

      {/* Settings panel */}
      {showSettings && (
        <SettingsPanel
          settings={settings}
          onUpdate={updateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
