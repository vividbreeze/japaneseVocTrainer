"use client";

import { hiraganaToKatakana } from "@/lib/romaji";
import type { DisplayScript } from "@/types/settings";

interface KanaDisplayProps {
  japanese: string;
  kana: string;
  romaji: string;
  displayScript: DisplayScript;
  showRomaji: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

const SIZE_CLASSES = {
  sm: "text-2xl",
  md: "text-4xl",
  lg: "text-5xl",
  xl: "text-6xl",
};

export function KanaDisplay({
  japanese,
  kana,
  romaji,
  displayScript,
  showRomaji,
  size = "lg",
}: KanaDisplayProps) {
  const sizeClass = SIZE_CLASSES[size];

  const getMainDisplay = () => {
    switch (displayScript) {
      case "hiragana":
        return kana;
      case "katakana":
        return hiraganaToKatakana(kana);
      case "kanji":
        return japanese;
      case "all":
        return japanese;
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Main display */}
      <div className={`japanese font-bold leading-tight text-center ${sizeClass}`}>
        {getMainDisplay()}
      </div>

      {/* In "all" mode, show all scripts */}
      {displayScript === "all" && japanese !== kana && (
        <div className="japanese text-2xl text-gray-400">
          {kana} / {hiraganaToKatakana(kana)}
        </div>
      )}

      {/* Romaji hint */}
      {showRomaji && (
        <div className="text-lg text-indigo-300 font-mono">{romaji}</div>
      )}
    </div>
  );
}
