import { expect, it } from "vitest";
import { processContext } from "./pipeline";

it("redacts secrets before state delta and payload generation", () => {
  const result = processContext(
    {
      previousState: {
        hp: 100,
        apiKey: "old-secret",
        credentials: {
          accessToken: "old-token",
        },
      },
      currentState: {
        hp: 90,
        apiKey: "new-secret",
        credentials: {
          accessToken: "new-token",
        },
      },
      context: [
        {
          id: "player",
          content: "Player HP: 90",
          priority: 100,
        },
      ],
    },
    {
      verify: {
        requiredKeys: ["context", "stateDelta"],
      },
    },
  );

  expect(result.delta).not.toBeNull();

  expect(
    result.delta?.changes.find(
      (change) => change.key === "apiKey",
    ),
  ).toEqual({
    key: "apiKey",
    previous: "[REDACTED]",
    current: "[REDACTED]",
  });

  expect(
    result.delta?.changes.find(
      (change) => change.key === "credentials",
    ),
  ).toEqual({
    key: "credentials",
    previous: {
      accessToken: "[REDACTED]",
    },
    current: {
      accessToken: "[REDACTED]",
    },
  });

  expect(result.payload.payload).not.toContain(
    "old-secret",
  );

  expect(result.payload.payload).not.toContain(
    "new-secret",
  );

  expect(result.payload.payload).not.toContain(
    "old-token",
  );

  expect(result.payload.payload).not.toContain(
    "new-token",
  );

  expect(result.payload.payload).toContain(
    "[REDACTED]",
  );

  expect(result.verification.valid).toBe(true);
});
