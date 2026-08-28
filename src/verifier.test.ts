import { describe, expect, it } from "vitest";
import { verifyPayload } from "./verifier.js";

describe("verifyPayload", () => {
  it("passes when all required keys are preserved", () => {
    const original = {
      state: {
        hp: 100,
        mana: 50,
      },
      player: {
        name: "Frieren",
      },
    };

    const compacted = {
      state: {
        hp: 100,
        mana: 50,
      },
      player: {
        name: "Frieren",
      },
    };

    const result = verifyPayload(original, compacted, {
      requiredKeys: [
        "state.hp",
        "state.mana",
        "player.name",
      ],
    });

    expect(result.valid).toBe(true);
    expect(result.missingKeys).toEqual([]);
  });

  it("detects missing required keys", () => {
    const original = {
      state: {
        hp: 100,
        mana: 50,
      },
    };

    const compacted = {
      state: {
        hp: 100,
      },
    };

    const result = verifyPayload(original, compacted, {
      requiredKeys: [
        "state.hp",
        "state.mana",
      ],
    });

    expect(result.valid).toBe(false);
    expect(result.missingKeys).toEqual(["state.mana"]);
  });

  it("allows explicitly permitted omissions", () => {
    const original = {
      state: {
        hp: 100,
        mana: 50,
      },
    };

    const compacted = {
      state: {
        hp: 100,
      },
    };

    const result = verifyPayload(original, compacted, {
      requiredKeys: [
        "state.hp",
        "state.mana",
      ],
      allowMissing: ["state.mana"],
    });

    expect(result.valid).toBe(true);
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].severity).toBe("warning");
  });

  it("supports nested paths", () => {
    const original = {
      world: {
        character: {
          status: {
            alive: true,
          },
        },
      },
    };

    const compacted = {
      world: {
        character: {
          status: {
            alive: true,
          },
        },
      },
    };

    const result = verifyPayload(original, compacted, {
      requiredKeys: ["world.character.status.alive"],
    });

    expect(result.valid).toBe(true);
  });
});
