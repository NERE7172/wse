import { describe, expect, it } from "vitest";
import { redactSecrets } from "./secret-redaction";

describe("secret redaction", () => {
  it("redacts common secret fields", () => {
    const input = {
      token: "secret-token",
      apiKey: "secret-api-key",
      password: "secret-password",
      name: "WSE",
    };

    expect(redactSecrets(input)).toEqual({
      token: "[REDACTED]",
      apiKey: "[REDACTED]",
      password: "[REDACTED]",
      name: "WSE",
    });
  });

  it("redacts nested secrets", () => {
    const input = {
      provider: {
        name: "example",
        credentials: {
          accessToken: "secret",
          privateKey: "private",
        },
      },
    };

    expect(redactSecrets(input)).toEqual({
      provider: {
        name: "example",
        credentials: {
          accessToken: "[REDACTED]",
          privateKey: "[REDACTED]",
        },
      },
    });
  });

  it("redacts secrets inside arrays", () => {
    const input = [
      {
        id: 1,
        token: "secret-1",
      },
      {
        id: 2,
        token: "secret-2",
      },
    ];

    expect(redactSecrets(input)).toEqual([
      {
        id: 1,
        token: "[REDACTED]",
      },
      {
        id: 2,
        token: "[REDACTED]",
      },
    ]);
  });

  it("supports a custom replacement", () => {
    const input = {
      authorization: "Bearer secret",
    };

    expect(
      redactSecrets(input, {
        replacement: "<hidden>",
      }),
    ).toEqual({
      authorization: "<hidden>",
    });
  });

  it("does not mutate the original object", () => {
    const input = {
      token: "secret",
      value: "safe",
    };

    const result = redactSecrets(input);

    expect(input).toEqual({
      token: "secret",
      value: "safe",
    });

    expect(result).toEqual({
      token: "[REDACTED]",
      value: "safe",
    });
  });

  it("handles circular references", () => {
    const input: Record<string, unknown> = {
      name: "WSE",
    };

    input.self = input;

    expect(redactSecrets(input)).toEqual({
      name: "WSE",
      self: "[CIRCULAR]",
    });
  });
});
