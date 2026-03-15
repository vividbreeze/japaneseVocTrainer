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
    <div className="flex flex-col items-center gap-3">
      {/* Main Japanese display — always white so it's visible on any bg */}
      <div
        className={`font-bold leading-tight text-center text-white ${sizeClass}`}
        style={{
          fontFamily:
            '"Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", "Noto Sans JP", "MS Gothic", sans-serif',
        }}
      >
        {getMainDisplay()}
      </div>

      {/* In "all" mode, show hiragana + katakana below kanji */}
      {displayScript === "all" && japanese !== kana && (
        <div
          className="text-2xl text-gray-300"
          style={{
            fontFamily:
              '"Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", "Noto Sans JP", sans-serif',
          }}
        >
          {kana} ・ {hiraganaToKatakana(kana)}
        </div>
      )}

      {/* Romaji hint */}
      {showRomaji && (
        <div className="text-base text-indigo-300 font-mono tracking-wider">{romaji}</div>
      )}
    </div>
  );
}
