export type StateRecord = Record<string, unknown>;

export type StateChange = {
  key: string;
  previous: unknown;
  current: unknown;
};

export type StateDelta = {
  changes: StateChange[];
  added: string[];
  removed: string[];
  changed: string[];
};

function isObject(value: unknown): value is object {
  return value !== null && typeof value === "object";
}

function isEqual(
  a: unknown,
  b: unknown,
  seen = new WeakMap<object, object>(),
): boolean {
  if (Object.is(a, b)) {
    return true;
  }

  if (!isObject(a) || !isObject(b)) {
    return false;
  }

  const previousMatch = seen.get(a);

  if (previousMatch === b) {
    return true;
  }

  seen.set(a, b);

  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) {
      return false;
    }

    if (a.length !== b.length) {
      return false;
    }

    for (let index = 0; index < a.length; index += 1) {
      if (!isEqual(a[index], b[index], seen)) {
        return false;
      }
    }

    return true;
  }

  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  if (aKeys.length !== bKeys.length) {
    return false;
  }

  for (const key of aKeys) {
    if (
      !Object.prototype.hasOwnProperty.call(b, key)
    ) {
      return false;
    }

    if (
      !isEqual(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key],
        seen,
      )
    ) {
      return false;
    }
  }

  return true;
}

export function computeStateDelta(
  previous: StateRecord,
  current: StateRecord,
): StateDelta {
  const changes: StateChange[] = [];
  const added: string[] = [];
  const removed: string[] = [];
  const changed: string[] = [];

  const keys = new Set([
    ...Object.keys(previous),
    ...Object.keys(current),
  ]);

  for (const key of keys) {
    const hasPrevious =
      Object.prototype.hasOwnProperty.call(previous, key);

    const hasCurrent =
      Object.prototype.hasOwnProperty.call(current, key);

    if (!hasPrevious && hasCurrent) {
      added.push(key);

      changes.push({
        key,
        previous: undefined,
        current: current[key],
      });

      continue;
    }

    if (hasPrevious && !hasCurrent) {
      removed.push(key);

      changes.push({
        key,
        previous: previous[key],
        current: undefined,
      });

      continue;
    }

    if (!isEqual(previous[key], current[key])) {
      changed.push(key);

      changes.push({
        key,
        previous: previous[key],
        current: current[key],
      });
    }
  }

  return {
    changes,
    added,
    removed,
    changed,
  };
}
