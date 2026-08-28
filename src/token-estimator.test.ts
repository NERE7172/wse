import { describe, expect, it } from "vitest";
import {
  estimateTokens,
  estimateContextTokens,
} from "./token-estimator.js";

describe("estimateTokens", () => {
  it("estimates tokens from character count", () => {
    const result = estimateTokens("Hello world");

    expect(result.characters).toBe(11);
    expect(result.tokens).toBe(3);
  });

  it("supports a custom chars-per-token ratio", () => {
    const result = estimateTokens("1234567890", {
      charsPerToken: 5,
    });

    expect(result.characters).toBe(10);
    expect(result.tokens).toBe(2);
  });

  it("rounds token estimates upward", () => {
    const result = estimateTokens("12345", {
      charsPerToken: 4,
    });

    expect(result.tokens).toBe(2);
  });

  it("rejects invalid chars-per-token values", () => {
    expect(() =>
      estimateTokens("Hello", {
        charsPerToken: 0,
      }),
    ).toThrow();
  });
});

describe("estimateContextTokens", () => {
  it("estimates tokens for multiple context items", () => {
    const result = estimateContextTokens([
      "Hello",
      "world",
    ]);

    expect(result.characters).toBe(11);
    expect(result.tokens).toBe(3);
  });
});
