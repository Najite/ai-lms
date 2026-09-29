/**
 * Base State Management Types for Zustand Stores
 */

export interface BaseStoreState {
  _hasHydrated?: boolean;
}

export interface BaseStoreActions {
  setHasHydrated?: (hasHydrated: boolean) => void;
  reset?: () => void;
}

export type StoreWithHydration<TState, TActions> = TState &
  TActions &
  BaseStoreState &
  BaseStoreActions;
