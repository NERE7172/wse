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

  // Non-secret state changes should still appear in the delta.
  expect(
    result.delta?.changes.find(
      (change) => change.key === "hp",
    ),
  ).toEqual({
    key: "hp",
    previous: 100,
    current: 90,
  });

  // Secret fields are redacted before delta calculation.
  // Therefore secret changes should not appear in the delta.
  expect(
    result.delta?.changes.find(
      (change) => change.key === "apiKey",
    ),
  ).toBeUndefined();

  expect(
    result.delta?.changes.find(
      (change) => change.key === "credentials",
    ),
  ).toBeUndefined();

  // Secret values must never appear in the generated payload.
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

  // The redacted marker should be present.
  expect(result.payload.payload).toContain(
    "[REDACTED]",
  );

  expect(result.verification.valid).toBe(true);
});
