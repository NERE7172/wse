export type RedactionOptions = {
  replacement?: string;
};

const DEFAULT_REPLACEMENT = "[REDACTED]";

const SECRET_KEY_PATTERN =
  /(token|secret|password|passwd|api[-_]?key|authorization|credential|private[-_]?key)/i;

function shouldRedactKey(key: string): boolean {
  return SECRET_KEY_PATTERN.test(key);
}

function redactValue(
  value: unknown,
  replacement: string,
  seen: WeakSet<object>,
): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value !== "object") {
    return value;
  }

  if (seen.has(value as object)) {
    return "[CIRCULAR]";
  }

  seen.add(value as object);

  if (Array.isArray(value)) {
    return value.map((item) =>
      redactValue(item, replacement, seen),
    );
  }

  const result: Record<string, unknown> = {};

  for (const [key, child] of Object.entries(
    value as Record<string, unknown>,
  )) {
    if (shouldRedactKey(key)) {
      result[key] = replacement;
      continue;
    }

    result[key] = redactValue(
      child,
      replacement,
      seen,
    );
  }

  return result;
}

export function redactSecrets(
  value: unknown,
  options: RedactionOptions = {},
): unknown {
  const replacement =
    options.replacement ?? DEFAULT_REPLACEMENT;

  return redactValue(
    value,
    replacement,
    new WeakSet<object>(),
  );
}
