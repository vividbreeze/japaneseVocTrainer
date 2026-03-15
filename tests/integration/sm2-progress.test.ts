import { describe, it, expect, beforeEach } from "vitest";
import { createTestDb, seedTestDb } from "./db-helpers";
import { progress } from "@db/schema";
import { eq } from "drizzle-orm";
import { applyReview, createInitialState } from "@/lib/sm2";

describe("SM-2 progress integration", () => {
  let db: ReturnType<typeof createTestDb>;

  beforeEach(async () => {
    db = createTestDb();
    await seedTestDb(db);
  });

  it("creates a progress record after first review", async () => {
    const vocabId = "test_001";
    const now = Date.now();
    const initial = createInitialState(now);
    const updated = applyReview(initial, 4, now);

    await db.insert(progress).values({
      vocabId,
      easinessFactor: updated.easinessFactor,
      interval: updated.interval,
      repetitions: updated.repetitions,
      dueDate: updated.dueDate,
      lastReviewed: now,
      correctCount: 1,
      incorrectCount: 0,
      createdAt: now,
    });

    const rows = await db
      .select()
      .from(progress)
      .where(eq(progress.vocabId, vocabId));

    expect(rows).toHaveLength(1);
    expect(rows[0].repetitions).toBe(1);
    expect(rows[0].interval).toBe(1);
    expect(rows[0].correctCount).toBe(1);
  });

  it("updates EF after a bad review (quality=0)", async () => {
    const vocabId = "test_002";
    const now = Date.now();

    // First good review
    let state = createInitialState(now);
    state = applyReview(state, 5, now);

    await db.insert(progress).values({
      vocabId,
      easinessFactor: state.easinessFactor,
      interval: state.interval,
      repetitions: state.repetitions,
      dueDate: state.dueDate,
      lastReviewed: now,
      correctCount: 1,
      incorrectCount: 0,
      createdAt: now,
    });

    // Now a bad review
    const efBefore = state.easinessFactor;
    state = applyReview(state, 0, now);

    await db
      .update(progress)
      .set({
        easinessFactor: state.easinessFactor,
        interval: state.interval,
        repetitions: state.repetitions,
        dueDate: state.dueDate,
        incorrectCount: 1,
      })
      .where(eq(progress.vocabId, vocabId));

    const rows = await db
      .select()
      .from(progress)
      .where(eq(progress.vocabId, vocabId));

    expect(rows[0].repetitions).toBe(0);
    expect(rows[0].easinessFactor).toBeLessThan(efBefore);
    expect(rows[0].interval).toBe(1);
  });
});
