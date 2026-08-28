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

it("runs the complete context processing pipeline", () => {
  const result = processContext(
    {
      previousState: {
        world: "Aurelia",
        day: 1,
        status: "idle",
      },
      currentState: {
        world: "Aurelia",
        day: 2,
        status: "active",
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
          id: "duplicate",
          content: "World: Aurelia",
          priority: 10,
        },
      ],
    },
    {
      verify: {
        requiredKeys: ["context", "stateDelta"],
      },
    },
  );

  // Optimizer should remove the duplicate context item.
  expect(result.optimized.items.length).toBe(2);
  expect(result.optimized.removedItems).toBeGreaterThan(0);

  // State delta should detect the changed fields.
  expect(result.delta).not.toBeNull();
  expect(result.delta?.changed).toContain("day");
  expect(result.delta?.changed).toContain("status");

  // The compact payload should be generated.
  expect(result.payload.payload).toBeTruthy();
  expect(result.payload.compactedCharacters).toBeGreaterThan(0);

  // Token estimation should run on the final payload.
  expect(result.tokens.characters).toBe(
    result.payload.payload.length,
  );

  expect(result.tokens.tokens).toBeGreaterThan(0);

  // Verification should succeed.
  expect(result.verification.valid).toBe(true);
});
