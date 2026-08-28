import { describe, expect, it } from "vitest";
import { computeStateDelta } from "./state-delta";

describe("computeStateDelta", () => {
  it("detects changed values", () => {
    const result = computeStateDelta(
      {
        mana: 100,
        location: "Lumia",
      },
      {
        mana: 82,
        location: "Lumia",
      },
    );

    expect(result.changed).toEqual(["mana"]);
    expect(result.changes).toEqual([
      {
        key: "mana",
        previous: 100,
        current: 82,
      },
    ]);
  });

  it("detects added state", () => {
    const result = computeStateDelta(
      {
        mana: 100,
      },
      {
        mana: 100,
        weather: "rain",
      },
    );

    expect(result.added).toEqual(["weather"]);
  });

  it("detects removed state", () => {
    const result = computeStateDelta(
      {
        mana: 100,
        weather: "rain",
      },
      {
        mana: 100,
      },
    );

    expect(result.removed).toEqual(["weather"]);
  });

  it("ignores unchanged state", () => {
    const result = computeStateDelta(
      {
        mana: 100,
        location: "Lumia",
      },
      {
        mana: 100,
        location: "Lumia",
      },
    );

    expect(result.changes).toHaveLength(0);
    expect(result.added).toHaveLength(0);
    expect(result.removed).toHaveLength(0);
    expect(result.changed).toHaveLength(0);
  });

  it("handles multiple changes", () => {
    const result = computeStateDelta(
      {
        mana: 100,
        hp: 80,
        location: "Lumia",
      },
      {
        mana: 75,
        hp: 80,
        location: "Farensia",
        weather: "rain",
      },
    );

    expect(result.changed).toEqual(["mana", "location"]);
    expect(result.added).toEqual(["weather"]);
    expect(result.removed).toEqual([]);
    expect(result.changes).toHaveLength(3);
  });

  it("handles nested state values", () => {
    const result = computeStateDelta(
      {
        player: {
          hp: 100,
          mana: 50,
        },
      },
      {
        player: {
          hp: 90,
          mana: 50,
        },
      },
    );

    expect(result.changed).toEqual(["player"]);
  });
});
