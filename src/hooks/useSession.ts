"use client";

import { useState, useEffect, useCallback } from "react";
import type { VocabEntry, TopicId, EntryType } from "@/types/vocab";
import type { ProgressRecord } from "@/types/progress";

type SessionMode = "learn" | "multiple-choice" | "free-input";

export interface SessionEntry extends VocabEntry {
  progress: ProgressRecord | null;
}

interface SessionResponse {
  entries: SessionEntry[];
  total: number;
  dueCount: number;
  newCount: number;
}

interface UseSessionResult {
  entries: SessionEntry[];
  currentIndex: number;
  currentEntry: SessionEntry | null;
  advance: (quality?: number) => Promise<void>;
  isComplete: boolean;
  isLoading: boolean;
  dueCount: number;
  newCount: number;
  total: number;
}

export function useSession(
  topicId: TopicId,
  mode: SessionMode,
  type: EntryType,
  sessionSize: number = 20
): UseSessionResult {
  const [entries, setEntries] = useState<SessionEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [dueCount, setDueCount] = useState(0);
  const [newCount, setNewCount] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchSession() {
      setIsLoading(true);
      setCurrentIndex(0);

      try {
        const params = new URLSearchParams({
          topicId,
          mode,
          type,
          limit: sessionSize === 0 ? "9999" : String(sessionSize),
        });

        const res = await fetch(`/api/session?${params.toString()}`);
        if (!res.ok) throw new Error(`Failed to fetch session: ${res.status}`);
        const data: SessionResponse = await res.json();

        if (!cancelled) {
          setEntries(data.entries);
          setDueCount(data.dueCount);
          setNewCount(data.newCount);
          setTotal(data.total);
        }
      } catch (err) {
        console.error("useSession fetch error:", err);
        if (!cancelled) {
          setEntries([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchSession();
    return () => { cancelled = true; };
  }, [topicId, mode, type, sessionSize]);

  const advance = useCallback(async (quality?: number): Promise<void> => {
    const entry = entries[currentIndex];

    if (entry && quality !== undefined) {
      try {
        const res = await fetch(`/api/progress/${entry.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quality }),
        });
        if (!res.ok) throw new Error(`Failed to submit rating: ${res.status}`);
        const updatedProgress: ProgressRecord = await res.json();

        // Update the progress on the entry in state
        setEntries((prev) =>
          prev.map((e, i) =>
            i === currentIndex ? { ...e, progress: updatedProgress } : e
          )
        );
      } catch (err) {
        console.error("useSession advance/submit error:", err);
      }
    }

    setCurrentIndex((prev) => prev + 1);
  }, [entries, currentIndex]);

  const isComplete = !isLoading && currentIndex >= entries.length;
  const currentEntry = entries[currentIndex] ?? null;

  return {
    entries,
    currentIndex,
    currentEntry,
    advance,
    isComplete,
    isLoading,
    dueCount,
    newCount,
    total,
  };
}
