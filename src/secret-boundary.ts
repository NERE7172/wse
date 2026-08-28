export type SecretSource = {
  token?: string;
};

export type SecretBoundaryResult = {
  hasToken: boolean;
  token: string | undefined;
};

export function resolveSecret(
  source: SecretSource = {},
): SecretBoundaryResult {
  const token =
    typeof source.token === "string" &&
    source.token.trim().length > 0
      ? source.token
      : undefined;

  return {
    hasToken: token !== undefined,
    token,
  };
}
