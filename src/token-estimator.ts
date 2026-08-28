export type TokenEstimate = {
  characters: number;
  tokens: number;
};

export type TokenEstimatorOptions = {
  charsPerToken?: number;
};

const DEFAULT_CHARS_PER_TOKEN = 4;

export function estimateTokens(
  text: string,
  options: TokenEstimatorOptions = {},
): TokenEstimate {
  const characters = text.length;
  const charsPerToken =
    options.charsPerToken ?? DEFAULT_CHARS_PER_TOKEN;

  if (charsPerToken <= 0) {
    throw new Error("charsPerToken must be greater than 0");
  }

  const tokens = Math.ceil(characters / charsPerToken);

  return {
    characters,
    tokens,
  };
}

export function estimateContextTokens(
  items: string[],
  options: TokenEstimatorOptions = {},
): TokenEstimate {
  return estimateTokens(items.join("\n"), options);
}
