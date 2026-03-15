"use client";

import { useState, useEffect, useCallback } from "react";
import type { ProgressRecord } from "@/types/progress";

interface UseProgressResult {
  progress: ProgressRecord | null;
  submitRating: (quality: number) => Promise<void>;
  isLoading: boolean;
}

export function useProgress(vocabId?: string): UseProgressResult {
  const [progress, setProgress] = useState<ProgressRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!vocabId) return;

    let cancelled = false;

    async function fetchProgress() {
      setIsLoading(true);

      try {
        const res = await fetch(`/api/progress/${vocabId}`);
        if (!res.ok) throw new Error(`Failed to fetch progress: ${res.status}`);
        const data: ProgressRecord | null = await res.json();
        if (!cancelled) setProgress(data);
      } catch (err) {
        console.error("useProgress fetch error:", err);
        if (!cancelled) setProgress(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchProgress();
    return () => { cancelled = true; };
  }, [vocabId]);

  const submitRating = useCallback(async (quality: number): Promise<void> => {
    if (!vocabId) return;

    try {
      const res = await fetch(`/api/progress/${vocabId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quality }),
      });
      if (!res.ok) throw new Error(`Failed to submit rating: ${res.status}`);
      const updated: ProgressRecord = await res.json();
      setProgress(updated);
    } catch (err) {
      console.error("useProgress submitRating error:", err);
    }
  }, [vocabId]);

  return { progress, submitRating, isLoading };
}
