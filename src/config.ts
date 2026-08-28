export type WSEConfig = {
  maxItems?: number;
  maxCharacters?: number;
  charsPerToken?: number;
  verify?: boolean;
};

export const DEFAULT_WSE_CONFIG: Required<WSEConfig> = {
  maxItems: 100,
  maxCharacters: 12000,
  charsPerToken: 4,
  verify: true,
};

export function createWSEConfig(
  overrides: WSEConfig = {},
): Required<WSEConfig> {
  const config = {
    ...DEFAULT_WSE_CONFIG,
    ...overrides,
  };

  if (config.maxItems < 0) {
    throw new Error("maxItems must be greater than or equal to 0");
  }

  if (config.maxCharacters < 0) {
    throw new Error(
      "maxCharacters must be greater than or equal to 0",
    );
  }

  if (config.charsPerToken <= 0) {
    throw new Error(
      "charsPerToken must be greater than 0",
    );
  }

  return config;
}
