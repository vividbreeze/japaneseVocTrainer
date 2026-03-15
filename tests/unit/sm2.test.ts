import { describe, it, expect } from "vitest";
import {
  createInitialState,
  applyReview,
  isDue,
  daysOverdue,
  type SM2Quality,
} from "@/lib/sm2";

const NOW = 1700000000000; // fixed timestamp for tests
const DAY = 24 * 60 * 60 * 1000;

describe("SM-2 createInitialState", () => {
  it("returns initial state with EF=2.5", () => {
    const s = createInitialState(NOW);
    expect(s.easinessFactor).toBe(2.5);
    expect(s.interval).toBe(0);
    expect(s.repetitions).toBe(0);
    expect(s.dueDate).toBe(NOW);
  });
});

describe("SM-2 applyReview - failure cases (quality < 3)", () => {
  it("quality=0: resets repetitions, sets interval=1", () => {
    const state = { easinessFactor: 2.5, interval: 10, repetitions: 3, dueDate: NOW };
    const next = applyReview(state, 0, NOW);
    expect(next.repetitions).toBe(0);
    expect(next.interval).toBe(1);
    expect(next.dueDate).toBeCloseTo(NOW + DAY, -3);
  });

  it("quality=1: resets repetitions, sets interval=1", () => {
    const state = { easinessFactor: 2.5, interval: 5, repetitions: 2, dueDate: NOW };
    const next = applyReview(state, 1, NOW);
    expect(next.repetitions).toBe(0);
    expect(next.interval).toBe(1);
  });

  it("quality=2: resets repetitions, sets interval=1", () => {
    const state = { easinessFactor: 2.5, interval: 5, repetitions: 2, dueDate: NOW };
    const next = applyReview(state, 2, NOW);
    expect(next.repetitions).toBe(0);
    expect(next.interval).toBe(1);
  });
});

describe("SM-2 applyReview - success cases (quality >= 3)", () => {
  it("first review (rep=0): interval=1", () => {
    const state = createInitialState(NOW);
    const next = applyReview(state, 4, NOW);
    expect(next.interval).toBe(1);
    expect(next.repetitions).toBe(1);
  });

  it("second review (rep=1): interval=6", () => {
    const state = { easinessFactor: 2.5, interval: 1, repetitions: 1, dueDate: NOW };
    const next = applyReview(state, 4, NOW);
    expect(next.interval).toBe(6);
    expect(next.repetitions).toBe(2);
  });

  it("third review (rep=2): interval = round(prev * EF)", () => {
    const state = { easinessFactor: 2.5, interval: 6, repetitions: 2, dueDate: NOW };
    const next = applyReview(state, 4, NOW);
    expect(next.interval).toBe(Math.round(6 * 2.5));
    expect(next.repetitions).toBe(3);
  });

  it("quality=5: EF increases", () => {
    const state = createInitialState(NOW);
    const next = applyReview(state, 5, NOW);
    expect(next.easinessFactor).toBeGreaterThan(2.5);
  });

  it("quality=3: EF decreases slightly", () => {
    const state = createInitialState(NOW);
    const next = applyReview(state, 3, NOW);
    expect(next.easinessFactor).toBeLessThan(2.5);
  });

  it("EF never drops below 1.3", () => {
    let state = createInitialState(NOW);
    // Apply many quality=0 reviews
    for (let i = 0; i < 20; i++) {
      state = applyReview(state, 0 as SM2Quality, NOW);
    }
    expect(state.easinessFactor).toBeGreaterThanOrEqual(1.3);
  });
});

describe("SM-2 isDue", () => {
  it("returns true when dueDate <= now", () => {
    const state = { ...createInitialState(NOW), dueDate: NOW - 1000 };
    expect(isDue(state, NOW)).toBe(true);
  });

  it("returns false when dueDate > now", () => {
    const state = { ...createInitialState(NOW), dueDate: NOW + 1000 };
    expect(isDue(state, NOW)).toBe(false);
  });
});

describe("SM-2 daysOverdue", () => {
  it("returns positive when overdue", () => {
    const state = { ...createInitialState(NOW), dueDate: NOW - 2 * DAY };
    expect(daysOverdue(state, NOW)).toBeCloseTo(2, 1);
  });

  it("returns negative when not yet due", () => {
    const state = { ...createInitialState(NOW), dueDate: NOW + 5 * DAY };
    expect(daysOverdue(state, NOW)).toBeCloseTo(-5, 1);
  });
});
