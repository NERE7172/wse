import { describe, expect, it } from "vitest";
import { processContext } from "./pipeline";

describe("processContext", () => {
  it("runs the complete WSE pipeline", () => {
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
        {
          id: "population",
          content: "Population: 31",
          priority: 80,
        },
      ],
    });

    expect(result.optimized.items.length).toBeGreaterThan(0);

    expect(result.delta).not.toBeNull();
    expect(result.delta?.changed).toContain("day");
    expect(result.delta?.changed).toContain("population");

    expect(result.payload.payload).toBeTruthy();
    expect(result.payload.compactedCharacters).toBeGreaterThan(0);

    expect(result.tokens.characters).toBe(
      result.payload.payload.length,
    );

    expect(result.tokens.tokens).toBeGreaterThan(0);

    expect(result.verification).toBeDefined();
    expect(result.verification.valid).toBe(true);
  });

  it("supports context-only processing", () => {
    const result = processContext({
      context: [
        {
          id: "message",
          content: "Hello world",
          priority: 100,
        },
      ],
    });

    expect(result.delta).toBeNull();
    expect(result.optimized.items).toHaveLength(1);
    expect(result.payload.payload).toBeTruthy();
    expect(result.tokens.tokens).toBeGreaterThan(0);
  });

  it("preserves the pipeline output structure", () => {
    const result = processContext({
      previousState: {
        hp: 100,
      },
      currentState: {
        hp: 90,
      },
      context: [
        {
          content: "Player HP: 90",
        },
      ],
    });

    expect(result).toHaveProperty("optimized");
    expect(result).toHaveProperty("delta");
    expect(result).toHaveProperty("payload");
    expect(result).toHaveProperty("tokens");
    expect(result).toHaveProperty("verification");
  });
});
