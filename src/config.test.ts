import { describe, expect, it } from "vitest";
import {
  DEFAULT_WSE_CONFIG,
  createWSEConfig,
} from "./config.js";

describe("WSE configuration", () => {
  it("provides safe defaults", () => {
    expect(DEFAULT_WSE_CONFIG.maxItems).toBe(100);
    expect(DEFAULT_WSE_CONFIG.maxCharacters).toBe(12000);
    expect(DEFAULT_WSE_CONFIG.charsPerToken).toBe(4);
    expect(DEFAULT_WSE_CONFIG.verify).toBe(true);
  });

  it("allows public configuration overrides", () => {
    const config = createWSEConfig({
      maxItems: 50,
      maxCharacters: 6000,
      charsPerToken: 5,
      verify: false,
    });

    expect(config).toEqual({
      maxItems: 50,
      maxCharacters: 6000,
      charsPerToken: 5,
      verify: false,
    });
  });

  it("merges partial configuration", () => {
    const config = createWSEConfig({
      maxItems: 25,
    });

    expect(config.maxItems).toBe(25);
    expect(config.maxCharacters).toBe(12000);
    expect(config.charsPerToken).toBe(4);
    expect(config.verify).toBe(true);
  });

  it("rejects negative item limits", () => {
    expect(() =>
      createWSEConfig({
        maxItems: -1,
      }),
    ).toThrow("maxItems must be greater than or equal to 0");
  });

  it("rejects negative character limits", () => {
    expect(() =>
      createWSEConfig({
        maxCharacters: -1,
      }),
    ).toThrow(
      "maxCharacters must be greater than or equal to 0",
    );
  });

  it("rejects invalid token estimation settings", () => {
    expect(() =>
      createWSEConfig({
        charsPerToken: 0,
      }),
    ).toThrow("charsPerToken must be greater than 0");
  });
});
