import { memo, useCallback, useRef } from 'react';
import { isEqual } from 'lodash-es';

/**
 * Improved memoization helper for React components
 * Uses deep equality check for props to prevent unnecessary re-renders
 */
export function memoWithDeepCompare<T extends React.ComponentType<any>>(
  Component: T,
  propsAreEqual = isEqual
): T {
  return memo(Component, propsAreEqual) as unknown as T;
}

/**
 * Generates a stable callback reference that doesn't change between renders
 * To be used for event handlers that don't need to be recreated
 */
export function createStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useCallback(callback, []) as T;
}

/**
 * Helper to create a memoized value with a deep equality check
 * Useful for memoizing complex objects that might look different but have the same data
 */
export function useMemoDeep<T>(factory: () => T, deps: React.DependencyList): T {
  const ref = useRef<{ deps: React.DependencyList; value: T }>();

  if (!ref.current || !depsAreEqual(deps, ref.current.deps)) {
    ref.current = { deps, value: factory() };
  }

  return ref.current.value;
}

// Helper for comparing dependency arrays with deep equality
function depsAreEqual(next: React.DependencyList, prev: React.DependencyList): boolean {
  if (next.length !== prev.length) {
    return false;
  }

  for (let i = 0; i < next.length; i++) {
    if (!isEqual(next[i], prev[i])) {
      return false;
    }
  }

  return true;
}