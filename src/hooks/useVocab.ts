"use client";

import { useState, useEffect } from "react";
import type { VocabEntry, TopicId, EntryType } from "@/types/vocab";

interface UseVocabResult {
  entries: VocabEntry[];
  isLoading: boolean;
  error: string | null;
}

export function useVocab(topicId: TopicId, type?: EntryType): UseVocabResult {
  const [entries, setEntries] = useState<VocabEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchVocab() {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({ topic: topicId });
        if (type) params.set("type", type);

        const res = await fetch(`/api/vocab?${params.toString()}`);
        if (!res.ok) throw new Error(`Failed to fetch vocab: ${res.status}`);
        const data: VocabEntry[] = await res.json();
        if (!cancelled) setEntries(data);
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Unknown error";
          setError(message);
          console.error("useVocab fetch error:", err);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchVocab();
    return () => { cancelled = true; };
  }, [topicId, type]);

  return { entries, isLoading, error };
}
