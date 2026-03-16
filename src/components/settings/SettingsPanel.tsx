"use client";

import { useState } from "react";
import type { UserSettings } from "@/types/settings";
import type { DisplayScript, InputMode, CardType } from "@/types/settings";

interface SettingsPanelProps {
  settings: UserSettings;
  onUpdate: (updates: Partial<UserSettings>) => void;
  onClose: () => void;
}

export function SettingsPanel({ settings, onUpdate, onClose }: SettingsPanelProps) {
  const [confirmReset, setConfirmReset] = useState(false);

  const handleReset = async () => {
    await fetch("/api/progress", { method: "DELETE" });
    setConfirmReset(false);
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative bg-[#1a1a2e] border border-[#2a2a4a] rounded-t-2xl sm:rounded-2xl w-full sm:w-[480px] max-h-[90vh] overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Einstellungen</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>

        {/* Display Script */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Anzeigeschrift</label>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                { value: "hiragana", label: "Kana", sub: "ひ・カ natürlich" },
                { value: "katakana", label: "Katakana", sub: "alles in カタカナ" },
                { value: "kanji",    label: "Kanji + Kana", sub: "漢字 wie im echten JP" },
                { value: "all",      label: "Alle Zeichen", sub: "漢字 + ひ + カ" },
              ] as { value: DisplayScript; label: string; sub: string }[]
            ).map(({ value, label, sub }) => (
              <button
                key={value}
                onClick={() => onUpdate({ displayScript: value })}
                className={`py-2 px-3 rounded-lg text-left transition-colors ${
                  settings.displayScript === value
                    ? "bg-indigo-600 text-white"
                    : "bg-[#2a2a4a] text-gray-300 hover:bg-[#3a3a5a]"
                }`}
              >
                <div className="text-sm font-medium">{label}</div>
                <div className={`text-xs mt-0.5 ${settings.displayScript === value ? "text-indigo-200" : "text-gray-500"}`}>{sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Input Mode */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Eingabemodus (Freie Eingabe)</label>
          <div className="grid grid-cols-2 gap-2">
            {(["romaji", "kana"] as InputMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => onUpdate({ inputMode: mode })}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  settings.inputMode === mode
                    ? "bg-indigo-600 text-white"
                    : "bg-[#2a2a4a] text-gray-300 hover:bg-[#3a3a5a]"
                }`}
              >
                {mode === "romaji" ? "Romaji" : "Kana (IME)"}
              </button>
            ))}
          </div>
        </div>

        {/* Card Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Kartentyp</label>
          <div className="grid grid-cols-2 gap-2">
            {(["word", "sentence"] as CardType[]).map((type) => (
              <button
                key={type}
                onClick={() => onUpdate({ cardType: type })}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  settings.cardType === type
                    ? "bg-indigo-600 text-white"
                    : "bg-[#2a2a4a] text-gray-300 hover:bg-[#3a3a5a]"
                }`}
              >
                {type === "word" ? "Wörter" : "Sätze"}
              </button>
            ))}
          </div>
        </div>

        {/* Session Size */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Wörter pro Einheit</label>
          <div className="grid grid-cols-3 gap-2">
            {([10, 20, 30, 50, 100, 0] as const).map((n) => (
              <button
                key={n}
                onClick={() => onUpdate({ sessionSize: n })}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  settings.sessionSize === n
                    ? "bg-indigo-600 text-white"
                    : "bg-[#2a2a4a] text-gray-300 hover:bg-[#3a3a5a]"
                }`}
              >
                {n === 0 ? "Alle" : n}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-3">
          <Toggle
            label="Romaji-Hinweis anzeigen"
            value={settings.showRomaji}
            onChange={(v) => onUpdate({ showRomaji: v })}
          />
          <Toggle
            label="Englisch anzeigen"
            value={settings.showEnglish}
            onChange={(v) => onUpdate({ showEnglish: v })}
          />
          <Toggle
            label="Worttyp anzeigen (Verb, Substantiv …)"
            value={settings.showPartOfSpeech}
            onChange={(v) => onUpdate({ showPartOfSpeech: v })}
          />
        </div>

        {/* Reset Progress */}
        <div className="pt-4 border-t border-[#2a2a4a]">
          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              className="w-full py-2 px-4 rounded-lg text-sm font-medium bg-red-900/30 text-red-400 hover:bg-red-900/50 transition-colors"
            >
              Lernfortschritt zurücksetzen
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-red-400 text-center">Sicher? Das kann nicht rückgängig gemacht werden.</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setConfirmReset(false)}
                  className="py-2 px-4 rounded-lg text-sm font-medium bg-[#2a2a4a] text-gray-300"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleReset}
                  className="py-2 px-4 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700"
                >
                  Zurücksetzen
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-300">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          value ? "bg-indigo-600" : "bg-gray-600"
        }`}
        aria-checked={value}
        role="switch"
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
            value ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
