export type VerificationIssue = {
  path: string;
  message: string;
  severity: "error" | "warning";
};

export type VerificationResult = {
  valid: boolean;
  issues: VerificationIssue[];
  preservedKeys: string[];
  missingKeys: string[];
};

export type VerifyOptions = {
  requiredKeys?: string[];
  allowMissing?: string[];
};

function hasPath(value: unknown, path: string): boolean {
  if (value === null || value === undefined) return false;

  const parts = path.split(".");
  let current: any = value;

  for (const part of parts) {
    if (
      current === null ||
      current === undefined ||
      typeof current !== "object" ||
      !(part in current)
    ) {
      return false;
    }

    current = current[part];
  }

  return true;
}

export function verifyPayload(
  original: unknown,
  compacted: unknown,
  options: VerifyOptions = {},
): VerificationResult {
  const requiredKeys = options.requiredKeys ?? [];
  const allowMissing = new Set(options.allowMissing ?? []);

  const issues: VerificationIssue[] = [];
  const preservedKeys: string[] = [];
  const missingKeys: string[] = [];

  for (const key of requiredKeys) {
    const originalHasKey = hasPath(original, key);
    const compactedHasKey = hasPath(compacted, key);

    if (!originalHasKey) {
      continue;
    }

    if (compactedHasKey) {
      preservedKeys.push(key);
      continue;
    }

    if (allowMissing.has(key)) {
      issues.push({
        path: key,
        message: "Required key was omitted but explicitly allowed.",
        severity: "warning",
      });
      continue;
    }

    missingKeys.push(key);

    issues.push({
      path: key,
      message: "Required key is missing from compacted payload.",
      severity: "error",
    });
  }

  return {
    valid: issues.every((issue) => issue.severity !== "error"),
    issues,
    preservedKeys,
    missingKeys,
  };
}
