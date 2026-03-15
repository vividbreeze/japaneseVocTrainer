"use client";

import { useState, useEffect, useCallback } from "react";
import type { UserSettings, DisplayScript, InputMode, CardType } from "@/types/settings";
import type { TopicId } from "@/types/vocab";

type PartialSettings = Partial<{
  displayScript: DisplayScript;
  inputMode: InputMode;
  showRomaji: boolean;
  showEnglish: boolean;
  cardType: CardType;
  topicsEnabled: TopicId[];
}>;

interface UseSettingsResult {
  settings: UserSettings | null;
  updateSettings: (updates: PartialSettings) => Promise<void>;
  isLoading: boolean;
}

export function useSettings(): UseSettingsResult {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchSettings() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/settings");
        if (!res.ok) throw new Error(`Failed to fetch settings: ${res.status}`);
        const data: UserSettings = await res.json();
        if (!cancelled) setSettings(data);
      } catch (err) {
        console.error("useSettings fetch error:", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchSettings();
    return () => { cancelled = true; };
  }, []);

  const updateSettings = useCallback(async (updates: PartialSettings): Promise<void> => {
    // Optimistically update local state
    setSettings((prev) => {
      if (!prev) return prev;
      return { ...prev, ...updates };
    });

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error(`Failed to update settings: ${res.status}`);
      const data: UserSettings = await res.json();
      setSettings(data);
    } catch (err) {
      console.error("useSettings update error:", err);
      // Revert optimistic update by re-fetching
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data: UserSettings = await res.json();
          setSettings(data);
        }
      } catch {
        // Ignore secondary fetch error
      }
    }
  }, []);

  return { settings, updateSettings, isLoading };
}
