import { useCallback, useState } from 'react';

/**
 * React state backed by `localStorage`, so on-device data (checklists, spotting
 * trackers, notes…) survives reloads and works fully offline — no backend.
 *
 * Keys are prefixed with `viaje:` and should include the trip id (e.g.
 * `packing:${trip.id}`) so trips that share an origin — like Cloudflare preview
 * deployments — don't collide. Reads and writes are defensive: if storage is
 * unavailable (private mode, quota) or a stored value is corrupt, it falls back
 * to `initial` instead of throwing.
 *
 * The key is assumed stable for a component's lifetime (it is, in this app).
 */
const PREFIX = 'viaje:';

function read<T>(key: string, initial: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw === null ? initial : (JSON.parse(raw) as T);
  } catch {
    /* storage unavailable or malformed JSON — use the initial value */
    return initial;
  }
}

/** One-off read of a persisted value (no React state) — for read-only views. */
export function readPersisted<T>(key: string, initial: T): T {
  return read(key, initial);
}

export function usePersistentState<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => read(key, initial));

  const set = useCallback(
    (value: T | ((prev: T) => T)) => {
      setState((prev) => {
        const next = typeof value === 'function' ? (value as (p: T) => T)(prev) : value;
        try {
          localStorage.setItem(PREFIX + key, JSON.stringify(next));
        } catch {
          /* storage full/unavailable — keep the in-memory value */
        }
        return next;
      });
    },
    [key],
  );

  return [state, set] as const;
}
