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

function isEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
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
    const hasPrevious = Object.prototype.hasOwnProperty.call(previous, key);
    const hasCurrent = Object.prototype.hasOwnProperty.call(current, key);

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
