import { bench, describe } from "vitest";

import {
  processContext,
  type PipelineInput,
} from "./pipeline.js";

function createContext(size: number): PipelineInput {
  const context = Array.from(
    { length: size },
    (_, index) => ({
      id: `item-${index}`,
      content:
        index % 5 === 0
          ? "World: Aurelia"
          : `Context item ${index}: village state and current events`,
      priority: index % 5 === 0 ? 100 : 50,
    }),
  );

  return {
    previousState: {
      world: "Aurelia",
      day: 1,
      season: "Spring",
      population: 30,
      status: "idle",
    },

    currentState: {
      world: "Aurelia",
      day: 2,
      season: "Spring",
      population: 31,
      status: "active",
    },

    context,
  };
}

describe("WSE pipeline performance", () => {
  bench("small context: 10 items", () => {
    processContext(createContext(10));
  });

  bench("medium context: 100 items", () => {
    processContext(createContext(100));
  });

  bench("large context: 1000 items", () => {
    processContext(createContext(1000));
  });
});
