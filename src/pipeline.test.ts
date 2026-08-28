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

  // Normal state changes should still appear.
  expect(
    result.delta?.changes.find(
      (change) => change.key === "hp",
    ),
  ).toEqual({
    key: "hp",
    previous: 100,
    current: 90,
  });

  // Secret changes should not appear in the delta
  // because secrets are redacted before delta calculation.
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

  // Raw secrets must never reach the payload.
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

  // The payload contains only the safe context and state delta.
  expect(result.payload.payload).toContain(
    "Player HP: 90",
  );

  expect(result.payload.payload).toContain(
    '"stateDelta"',
  );

  expect(result.verification.valid).toBe(true);
});
