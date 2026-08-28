import { describe, expect, it } from "vitest";

import {
  compactPayload,
  computeStateDelta,
  estimateContextTokens,
  estimateTokens,
  optimizeContext,
  type ContextItem,
  type StateRecord,
} from "./index.js";

describe("WSE integration", () => {
  it("exports and connects all core modules", () => {
    const previous: StateRecord = {
      world: "Aurelia",
      day: 1,
      season: "Spring",
      population: 30,
    };

    const current: StateRecord = {
      world: "Aurelia",
      day: 2,
      season: "Spring",
      population: 31,
    };

    const delta = computeStateDelta(previous, current);

    expect(delta.added).toEqual([]);
    expect(delta.removed).toEqual([]);
    expect(delta.changed).toContain("day");
    expect(delta.changed).toContain("population");

    const context: ContextItem[] = [
      {
        id: "world",
        content: "World: Aurelia",
        priority: 100,
      },
      {
        id: "day",
        content: "Current day: 2",
        priority: 90,
      },
      {
        id: "population",
        content: "Village population: 31",
        priority: 80,
      },
      {
        id: "duplicate",
        content: "World: Aurelia",
        priority: 10,
      },
    ];

    const optimized = optimizeContext(context);

    expect(optimized.items.length).toBeLessThan(context.length);
    expect(optimized.removedItems).toBeGreaterThan(0);

    const payloadSource = {
      state: current,
      changes: delta.changed,
      context: optimized.items,
    };

    const compacted = compactPayload(payloadSource);

    expect(compacted.payload).toBeTruthy();
    expect(compacted.originalCharacters).toBeGreaterThan(0);
    expect(compacted.compactedCharacters).toBeGreaterThan(0);

    const tokenEstimate = estimateTokens(compacted.payload);

    expect(tokenEstimate.characters).toBe(compacted.payload.length);
    expect(tokenEstimate.tokens).toBeGreaterThanOrEqual(0);

    const contextTokenEstimate = estimateContextTokens(
      optimized.items.map((item) => item.content),
    );

    expect(contextTokenEstimate.characters).toBeGreaterThan(0);
    expect(contextTokenEstimate.tokens).toBeGreaterThanOrEqual(0);
  });
});
