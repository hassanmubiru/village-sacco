'use client';

import { useCallback, useRef, useState, useEffect } from 'react';

/**
 * Utility function to safely handle big integers in UI rendering
 * @param value - The bigint or string representing a large number
 * @param decimals - Number of decimals (default 18 for ETH)
 * @returns A formatted string representation for display
 */
export function formatBigInt(value: bigint | string | undefined, decimals = 18): string {
  if (value === undefined) return '0';
  
  try {
    // Convert string to bigint if needed
    const bigIntValue = typeof value === 'string' ? BigInt(value) : value;
    
    // Format with the specified number of decimals
    const divisor = BigInt(10 ** decimals);
    const integerPart = bigIntValue / divisor;
    const fractionalPart = bigIntValue % divisor;
    
    // Add leading zeros to fractional part
    const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
    
    // Trim trailing zeros
    const trimmedFractionalStr = fractionalStr.replace(/0+$/, '');
    
    // Combine parts
    return trimmedFractionalStr 
      ? `${integerPart}.${trimmedFractionalStr}` 
      : integerPart.toString();
  } catch (error) {
    console.error('Error formatting bigint:', error);
    return '0';
  }
}

/**
 * Debounces a function call to improve performance
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns A debounced version of the function
 */
export function useDebounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedFn = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        fn(...args);
      }, delay);
    },
    [fn, delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedFn;
}

/**
 * Improved version of useState that tracks render counts for debugging
 */
export function useTrackedState<T>(initialState: T) {
  const [state, setState] = useState<T>(initialState);
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current += 1;
    
    if (renderCount.current > 5 && process.env.NODE_ENV === 'development') {
      console.warn(`Component re-rendered ${renderCount.current} times with state:`, state);
    }
  });
  
  return [state, setState] as const;
}

/**
 * Memoization helper that works better than useMemo for complex objects 
 * by using JSON.stringify for deep comparison
 */
export function useDeepMemo<T>(value: T, deps: any[]): T {
  const ref = useRef<{value: T, stringified: string}>({
    value,
    stringified: JSON.stringify(value)
  });
  
  const stringified = JSON.stringify(value);
  
  if (stringified !== ref.current.stringified) {
    ref.current = { value, stringified };
  }
  
  return ref.current.value;
}
