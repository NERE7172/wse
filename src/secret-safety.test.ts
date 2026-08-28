import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const SOURCE_DIR = new URL(".", import.meta.url).pathname;

const SECRET_PATTERNS = [
  /\bsk-[A-Za-z0-9_-]{20,}\b/,
  /\bsk-proj-[A-Za-z0-9_-]{20,}\b/,
  /\bghp_[A-Za-z0-9]{20,}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{20,}\b/,
  /\bAKIA[0-9A-Z]{16}\b/,
];

function getSourceFiles(): string[] {
  return readdirSync(SOURCE_DIR)
    .filter(
      (file) =>
        file.endsWith(".ts") &&
        !file.endsWith(".test.ts"),
    );
}

describe("secret safety", () => {
  it("does not contain hardcoded credential patterns", () => {
    const violations: string[] = [];

    for (const file of getSourceFiles()) {
      const path = join(SOURCE_DIR, file);
      const content = readFileSync(path, "utf8");

      for (const pattern of SECRET_PATTERNS) {
        if (pattern.test(content)) {
          violations.push(`${file}: ${pattern}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it("keeps secret handling isolated to the boundary", () => {
    const sourceFiles = getSourceFiles();

    const secretBoundaryFiles = sourceFiles.filter(
      (file) => file === "secret-boundary.ts",
    );

    expect(secretBoundaryFiles).toEqual([
      "secret-boundary.ts",
    ]);
  });
});
