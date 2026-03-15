"use client";

import { use } from "react";
import Link from "next/link";
import { TOPIC_META } from "@/types/vocab";
import type { TopicId } from "@/types/vocab";
import { useSettings } from "@/hooks/useSettings";
import { SettingsPanel } from "@/components/settings/SettingsPanel";
import { useState } from "react";

export default function TopicPage({ params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = use(params);
  const [showSettings, setShowSettings] = useState(false);
  const { settings, updateSettings, isLoading } = useSettings();

  const meta = TOPIC_META[topicId as TopicId];

  if (!meta) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">404</div>
          <p className="text-gray-400">Topic not found</p>
          <Link href="/" className="text-indigo-400 hover:text-indigo-300 mt-4 inline-block">
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400 animate-pulse">Loading...</div>
      </div>
    );
  }

  const cardType = settings.cardType;

  const modes = [
    {
      id: "learn",
      name: "Flashcards",
      nameJa: "フラッシュカード",
      description: "Flip cards and rate how well you know each word",
      emoji: "🎴",
      href: `/topic/${topicId}/learn`,
      color: "from-indigo-600/20 to-indigo-600/5",
      borderColor: "hover:border-indigo-500",
    },
    {
      id: "multiple-choice",
      name: "Multiple Choice",
      nameJa: "多択",
      description: "Choose the correct English meaning from 4 options",
      emoji: "🎯",
      href: `/topic/${topicId}/quiz/multiple-choice`,
      color: "from-purple-600/20 to-purple-600/5",
      borderColor: "hover:border-purple-500",
    },
    {
      id: "free-input",
      name: "Free Input",
      nameJa: "自由入力",
      description: `Type the ${settings.inputMode === "romaji" ? "romaji" : "kana"} for each word`,
      emoji: "✏️",
      href: `/topic/${topicId}/quiz/free-input`,
      color: "from-pink-600/20 to-pink-600/5",
      borderColor: "hover:border-pink-500",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0f0f1a]/90 backdrop-blur-sm border-b border-[#2a2a4a]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1">
            ← Topics
          </Link>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-lg hover:bg-[#2a2a4a] transition-colors text-gray-300 hover:text-white text-xl"
            aria-label="Open settings"
          >
            ⚙️
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Topic header */}
        <div className="flex items-center gap-4">
          <div className="text-5xl">{meta.emoji}</div>
          <div>
            <h1 className="text-3xl font-bold">{meta.name}</h1>
            <div className="japanese text-xl text-gray-400">{meta.nameJa}</div>
          </div>
        </div>

        {/* Card type indicator */}
        <div className="flex gap-2 items-center text-sm text-gray-400">
          <span>Currently studying:</span>
          <span className="bg-[#2a2a4a] px-2 py-0.5 rounded-full text-gray-200">
            {cardType === "word" ? "Words" : "Sentences"}
          </span>
          <button
            onClick={() => setShowSettings(true)}
            className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
          >
            Change in settings
          </button>
        </div>

        {/* Mode cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {modes.map((mode) => (
            <Link
              key={mode.id}
              href={`${mode.href}?type=${cardType}`}
              className={`group bg-gradient-to-br ${mode.color} border border-[#2a2a4a] ${mode.borderColor} rounded-2xl p-6 transition-all duration-200 hover:scale-[1.02] flex flex-col gap-3`}
            >
              <div className="text-4xl">{mode.emoji}</div>
              <div>
                <div className="font-bold text-lg">{mode.name}</div>
                <div className="japanese text-sm text-gray-400">{mode.nameJa}</div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">{mode.description}</p>
            </Link>
          ))}
        </div>
      </main>

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
