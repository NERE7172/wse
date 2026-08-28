import { describe, expect, it } from "vitest";

import {
  processContext,
  optimizeContext,
  estimateTokens,
  computeStateDelta,
  compactPayload,
  verifyPayload,
} from "./index.js";

describe("WSE public API", () => {
  it("exposes all core public functions", () => {
    expect(typeof processContext).toBe("function");
    expect(typeof optimizeContext).toBe("function");
    expect(typeof estimateTokens).toBe("function");
    expect(typeof computeStateDelta).toBe("function");
    expect(typeof compactPayload).toBe("function");
    expect(typeof verifyPayload).toBe("function");
  });

  it("processes a context through the public API", () => {
    const result = processContext({
      previousState: {
        day: 1,
        population: 30,
      },
      currentState: {
        day: 2,
        population: 31,
      },
      context: [
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
      ],
    });

    expect(result.optimized.items.length).toBeGreaterThan(0);
    expect(result.delta?.changed).toContain("day");
    expect(result.payload.payload).toBeTruthy();
    expect(result.tokens.tokens).toBeGreaterThan(0);
    expect(result.verification.valid).toBe(true);
  });

  it("keeps individual APIs usable", () => {
    const optimized = optimizeContext([
      {
        content: "Hello   world",
        priority: 10,
      },
    ]);

    expect(optimized.items).toHaveLength(1);

    const tokens = estimateTokens("Hello world");
    expect(tokens.tokens).toBeGreaterThan(0);

    const delta = computeStateDelta(
      { hp: 100 },
      { hp: 90 },
    );

    expect(delta.changed).toEqual(["hp"]);

    const payload = compactPayload({
      message: "Hello world",
    });

    expect(payload.payload).toBeTruthy();

    const verification = verifyPayload(
      { message: "Hello world" },
      { message: "Hello world" },
      {
        requiredKeys: ["message"],
      },
    );

    expect(verification.valid).toBe(true);
  });
});
