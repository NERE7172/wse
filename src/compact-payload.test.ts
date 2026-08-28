import { describe, expect, it } from "vitest";
import { compactPayload } from "./compact-payload.js";

describe("compactPayload", () => {
  it("normalizes unnecessary whitespace", () => {
    const result = compactPayload("  Hello   world  ");

    expect(result.payload).toBe('"Hello world"');
  });

  it("compacts nested structured data", () => {
    const result = compactPayload({
      name: "  Javier  ",
      state: {
        location: "  Arden   Village  ",
      },
    });

    expect(result.payload).toBe(
      '{"name":"Javier","state":{"location":"Arden Village"}}',
    );
  });

  it("respects the character budget", () => {
    const result = compactPayload(
      {
        message: "This is a long message",
      },
      {
        maxCharacters: 10,
      },
    );

    expect(result.compactedCharacters).toBe(10);
    expect(result.payload.length).toBe(10);
    expect(result.truncated).toBe(true);
  });

  it("does not truncate when within budget", () => {
    const result = compactPayload(
      {
        message: "Hello",
      },
      {
        maxCharacters: 100,
      },
    );

    expect(result.truncated).toBe(false);
  });

  it("reports original and compacted character counts", () => {
    const result = compactPayload("  Hello   world  ");

    expect(result.originalCharacters).toBeGreaterThan(
      result.compactedCharacters,
    );
  });
});
