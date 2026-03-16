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
  masteredCount: number;
  total: number;
  dueCount: number;
  newCount: number;
}

export function useSession(
  topicId: TopicId,
  mode: SessionMode,
  type: EntryType,
  sessionSize: number = 20
): UseSessionResult {
  const [queue, setQueue] = useState<SessionEntry[]>([]);
  const [masteredCount, setMasteredCount] = useState(0);
  const [originalTotal, setOriginalTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [dueCount, setDueCount] = useState(0);
  const [newCount, setNewCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchSession() {
      setIsLoading(true);

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
          setQueue(data.entries);
          setOriginalTotal(data.entries.length);
          setMasteredCount(0);
          setDueCount(data.dueCount);
          setNewCount(data.newCount);
        }
      } catch (err) {
        console.error("useSession fetch error:", err);
        if (!cancelled) {
          setQueue([]);
          setOriginalTotal(0);
          setMasteredCount(0);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchSession();
    return () => { cancelled = true; };
  }, [topicId, mode, type, sessionSize]);

  const advance = useCallback(async (quality?: number): Promise<void> => {
    const entry = queue[0];
    if (!entry) return;

    let updatedEntry: SessionEntry = entry;

    if (quality !== undefined) {
      try {
        const res = await fetch(`/api/progress/${entry.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quality }),
        });
        if (!res.ok) throw new Error(`Failed to submit rating: ${res.status}`);
        const updatedProgress: ProgressRecord = await res.json();
        updatedEntry = { ...entry, progress: updatedProgress };
      } catch (err) {
        console.error("useSession advance/submit error:", err);
      }
    }

    if (quality !== undefined && quality >= 3) {
      // Mastered: remove from queue
      setQueue((prev) => prev.slice(1));
      setMasteredCount((prev) => prev + 1);
    } else {
      // Not mastered or skipped: move to end of queue
      setQueue((prev) => [...prev.slice(1), updatedEntry]);
    }
  }, [queue]);

  const isComplete = queue.length === 0 && !isLoading && originalTotal > 0;
  const currentEntry = queue[0] ?? null;

  return {
    entries: queue,
    currentIndex: 0,
    currentEntry,
    advance,
    isComplete,
    isLoading,
    masteredCount,
    total: originalTotal,
    dueCount,
    newCount,
  };
}
