export type CompactPayloadOptions = {
  maxCharacters?: number;
};

export type CompactPayloadResult = {
  payload: string;
  originalCharacters: number;
  compactedCharacters: number;
  truncated: boolean;
};

function normalize(value: unknown): unknown {
  if (typeof value === "string") {
    return value.replace(/\s+/g, " ").trim();
  }

  if (Array.isArray(value)) {
    return value.map(normalize);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .map(([key, entry]) => [key, normalize(entry)]),
    );
  }

  return value;
}

export function compactPayload(
  value: unknown,
  options: CompactPayloadOptions = {},
): CompactPayloadResult {
  const normalized = normalize(value);

  const payload = JSON.stringify(normalized);
  const originalCharacters = JSON.stringify(value).length;

  const maxCharacters = options.maxCharacters;

  if (
    maxCharacters === undefined ||
    payload.length <= maxCharacters
  ) {
    return {
      payload,
      originalCharacters,
      compactedCharacters: payload.length,
      truncated: false,
    };
  }

  return {
    payload: payload.slice(0, maxCharacters),
    originalCharacters,
    compactedCharacters: maxCharacters,
    truncated: true,
  };
}
