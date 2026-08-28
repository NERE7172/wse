export type ContextItem = {
  id?: string;
  content: string;
  priority?: number;
};

export type OptimizerOptions = {
  maxItems?: number;
  maxCharacters?: number;
};

export type OptimizationResult = {
  items: ContextItem[];
  originalCharacters: number;
  optimizedCharacters: number;
  removedItems: number;
};

function normalize(text: string): string {
  return text
    .replace(/\s+/g, " ")
    .trim();
}

function deduplicate(items: ContextItem[]): ContextItem[] {
  const seen = new Set<string>();

  return items.filter((item) => {
    const key = normalize(item.content).toLowerCase();

    if (!key || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function prioritize(items: ContextItem[]): ContextItem[] {
  return [...items].sort(
    (a, b) => (b.priority ?? 0) - (a.priority ?? 0),
  );
}

function compact(items: ContextItem[]): ContextItem[] {
  return items.map((item) => ({
    ...item,
    content: normalize(item.content),
  }));
}

export function optimizeContext(
  input: ContextItem[],
  options: OptimizerOptions = {},
): OptimizationResult {
  const originalCharacters = input.reduce(
    (total, item) => total + item.content.length,
    0,
  );

  let result = compact(input);
  result = deduplicate(result);
  result = prioritize(result);

  if (options.maxItems !== undefined) {
    result = result.slice(0, Math.max(0, options.maxItems));
  }

  if (options.maxCharacters !== undefined) {
    const limited: ContextItem[] = [];
    let characters = 0;

    for (const item of result) {
      if (characters + item.content.length > options.maxCharacters) {
        break;
      }

      limited.push(item);
      characters += item.content.length;
    }

    result = limited;
  }

  const optimizedCharacters = result.reduce(
    (total, item) => total + item.content.length,
    0,
  );

  return {
    items: result,
    originalCharacters,
    optimizedCharacters,
    removedItems: input.length - result.length,
  };
}
