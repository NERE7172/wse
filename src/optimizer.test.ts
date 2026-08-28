import { describe, expect, it } from "vitest";
import { optimizeContext } from "./optimizer";

describe("optimizeContext", () => {
  it("removes duplicate context items", () => {
    const result = optimizeContext([
      { content: "Hello world" },
      { content: "Hello world" },
      { content: "Important data", priority: 10 },
    ]);

    expect(result.items).toHaveLength(2);
    expect(result.removedItems).toBe(1);
  });

  it("normalizes unnecessary whitespace", () => {
    const result = optimizeContext([
      { content: "  Hello    world   " },
    ]);

    expect(result.items[0].content).toBe("Hello world");
  });

  it("prioritizes important context", () => {
    const result = optimizeContext([
      { content: "Low priority", priority: 1 },
      { content: "High priority", priority: 10 },
    ]);

    expect(result.items[0].content).toBe("High priority");
  });

  it("limits the number of context items", () => {
    const result = optimizeContext(
      [
        { content: "A" },
        { content: "B" },
        { content: "C" },
      ],
      { maxItems: 2 },
    );

    expect(result.items).toHaveLength(2);
  });

  it("reports character reduction", () => {
    const result = optimizeContext(
      [
        { content: "Hello world" },
        { content: "Hello world" },
        { content: "Important information" },
      ],
      { maxItems: 2 },
    );

    expect(result.optimizedCharacters).toBeLessThan(
      result.originalCharacters,
    );
  });
});
