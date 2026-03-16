import { NextResponse } from "next/server";
import { db } from "@db/client";
import { vocabEntries, progress } from "@db/schema";
import { eq } from "drizzle-orm";

/**
 * GET /api/session
 * Returns an ordered list of vocab entries for a study session.
 *
 * Query params:
 *   topicId   - filter by topic (required)
 *   mode      - "learn" | "multiple-choice" | "free-input"
 *   type      - "word" | "sentence" (default: "word")
 *   limit     - max cards in session (default: 20)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topicId = searchParams.get("topicId");
  const cardType = searchParams.get("type") ?? "word";
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "50"), 200);

  if (!topicId) {
    return NextResponse.json({ error: "topicId is required" }, { status: 400 });
  }

  try {
    const now = Date.now();

    // Get all vocab for this topic + type
    const vocab = await db
      .select()
      .from(vocabEntries)
      .where(eq(vocabEntries.topicId, topicId));

    const filtered = cardType === "word" || cardType === "sentence"
      ? vocab.filter((v) => v.type === cardType)
      : vocab;

    if (filtered.length === 0) {
      return NextResponse.json({ entries: [], total: 0 });
    }

    // Get all progress for these vocab
    const allProgress = await db.select().from(progress);
    const progressMap = new Map(allProgress.map((p) => [p.vocabId, p]));

    // Categorize cards
    const dueCards: typeof filtered = [];
    const newCards: typeof filtered = [];
    const futureCards: typeof filtered = [];

    for (const entry of filtered) {
      const p = progressMap.get(entry.id);
      if (!p) {
        newCards.push(entry);
      } else if (p.dueDate <= now) {
        dueCards.push(entry);
      } else {
        futureCards.push(entry);
      }
    }

    // Sort due cards by most overdue first
    dueCards.sort((a, b) => {
      const pa = progressMap.get(a.id)!;
      const pb = progressMap.get(b.id)!;
      return pa.dueDate - pb.dueDate;
    });

    // Build session: due first, then new, then future (if still need to fill)
    const sessionCards = [...dueCards, ...newCards].slice(0, limit);

    // If session is smaller than limit, add some future cards (preview)
    if (sessionCards.length < limit) {
      const remaining = limit - sessionCards.length;
      sessionCards.push(
        ...futureCards
          .sort((a, b) => {
            const pa = progressMap.get(a.id)!;
            const pb = progressMap.get(b.id)!;
            return pa.dueDate - pb.dueDate;
          })
          .slice(0, remaining)
      );
    }

    const result = sessionCards.map((entry) => ({
      ...entry,
      tags: JSON.parse(entry.tags ?? "[]") as string[],
      progress: progressMap.get(entry.id) ?? null,
    }));

    return NextResponse.json({
      entries: result,
      total: filtered.length,
      dueCount: dueCards.length,
      newCount: newCards.length,
    });
  } catch (error) {
    console.error("GET /api/session error:", error);
    return NextResponse.json({ error: "Failed to build session" }, { status: 500 });
  }
}
