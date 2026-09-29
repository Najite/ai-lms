import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Custom React hook to safely hydrate Zustand state on the client without SSR mismatch warnings.
 * Uses React's useSyncExternalStore to reliably detect client-side hydration.
 */
export function useSafeStore<T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F
): F | undefined {
  const result = store(callback) as F;

  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  return isHydrated ? result : undefined;
}
