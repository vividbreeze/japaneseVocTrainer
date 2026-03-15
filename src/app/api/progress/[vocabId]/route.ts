import { NextResponse } from "next/server";
import { db } from "@db/client";
import { progress } from "@db/schema";
import { eq } from "drizzle-orm";
import { applyReview, createInitialState } from "@/lib/sm2";
import type { SM2Quality } from "@/lib/sm2";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ vocabId: string }> }
) {
  const { vocabId } = await params;

  try {
    const rows = await db
      .select()
      .from(progress)
      .where(eq(progress.vocabId, vocabId))
      .limit(1);

    if (rows.length === 0) {
      return NextResponse.json(null);
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("GET /api/progress/[vocabId] error:", error);
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ vocabId: string }> }
) {
  const { vocabId } = await params;

  try {
    const body = await request.json() as { quality: number };
    const quality = Math.max(0, Math.min(5, body.quality)) as SM2Quality;
    const now = Date.now();

    // Get or create progress record
    const existing = await db
      .select()
      .from(progress)
      .where(eq(progress.vocabId, vocabId))
      .limit(1);

    let currentState;
    if (existing.length === 0) {
      currentState = createInitialState(now);
    } else {
      const r = existing[0];
      currentState = {
        easinessFactor: r.easinessFactor,
        interval: r.interval,
        repetitions: r.repetitions,
        dueDate: r.dueDate,
      };
    }

    const newState = applyReview(currentState, quality, now);

    if (existing.length === 0) {
      // Insert new record
      await db.insert(progress).values({
        vocabId,
        easinessFactor: newState.easinessFactor,
        interval: newState.interval,
        repetitions: newState.repetitions,
        dueDate: newState.dueDate,
        lastReviewed: now,
        correctCount: quality >= 3 ? 1 : 0,
        incorrectCount: quality < 3 ? 1 : 0,
        createdAt: now,
      });
    } else {
      const old = existing[0];
      await db
        .update(progress)
        .set({
          easinessFactor: newState.easinessFactor,
          interval: newState.interval,
          repetitions: newState.repetitions,
          dueDate: newState.dueDate,
          lastReviewed: now,
          correctCount: old.correctCount + (quality >= 3 ? 1 : 0),
          incorrectCount: old.incorrectCount + (quality < 3 ? 1 : 0),
        })
        .where(eq(progress.vocabId, vocabId));
    }

    const updated = await db
      .select()
      .from(progress)
      .where(eq(progress.vocabId, vocabId))
      .limit(1);

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("PATCH /api/progress/[vocabId] error:", error);
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
  }
}
