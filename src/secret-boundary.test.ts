import { describe, expect, it } from "vitest";
import { resolveSecret } from "./secret-boundary.js";

describe("secret boundary", () => {
  it("does not create a secret when none is provided", () => {
    const result = resolveSecret();

    expect(result.hasToken).toBe(false);
    expect(result.token).toBeUndefined();
  });

  it("accepts a token supplied externally", () => {
    const result = resolveSecret({
      token: "external-token",
    });

    expect(result.hasToken).toBe(true);
    expect(result.token).toBe("external-token");
  });

  it("rejects empty tokens", () => {
    const result = resolveSecret({
      token: "   ",
    });

    expect(result.hasToken).toBe(false);
    expect(result.token).toBeUndefined();
  });

  it("does not modify the supplied token", () => {
    const token = "external-token";

    const result = resolveSecret({ token });

    expect(result.token).toBe(token);
  });
});
