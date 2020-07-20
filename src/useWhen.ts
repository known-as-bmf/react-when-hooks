import {
  DependencyList,
  EffectCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
} from 'react';

import { MatchFunction } from './types';

/**
 * `useEffect` with a predicate that all dependencies must match in order to be triggered.
 * @param effect The effect function to call when all the dependencies match the given predicate.
 * @param match The predicate function that all dependencies must match.
 * @param deps The dependency array.
 */
export function useEffectWhen(
  effect: EffectCallback,
  match: MatchFunction,
  deps: DependencyList
): void {
  useEffect(() => (deps.every(match) ? effect() : undefined), deps);
}

/**
 * `useLayoutEffect` with a predicate that all dependencies must match in order to be triggered.
 * @param effect The effect function to call when all the dependencies match the given predicate.
 * @param match The predicate function that all dependencies must match.
 * @param deps The dependency array.
 */
export function useLayoutEffectWhen(
  effect: EffectCallback,
  match: MatchFunction,
  deps: DependencyList
): void {
  useLayoutEffect(() => (deps.every(match) ? effect() : undefined), deps);
}

/**
 * `useMemo` with a predicate that all dependencies must match in order to generate the value.
 * @param factory The value generating function to call when all the dependencies match the given predicate.
 * @param match The predicate function that all dependencies must match.
 * @param deps The dependency array.
 *
 * @returns The value generated by the factory if all dependencies match the predicate, `undefined` otherwise.
 */
export function useMemoWhen<T extends unknown>(
  factory: () => T,
  match: MatchFunction,
  deps: DependencyList
): T | undefined {
  return useMemo(() => (deps.every(match) ? factory() : undefined), deps);
}

/**
 * `useCallback` with a predicate that all dependencies must match in order to generate the callback.
 * @param callback The callback to create when all the dependencies match the given predicate.
 * @param match The predicate function that all dependencies must match.
 * @param deps The dependency array.
 *
 * @returns The callback if all dependencies match the predicate, `undefined` otherwise.
 */
export function useCallbackWhen<T extends (...args: unknown[]) => unknown>(
  callback: T,
  match: MatchFunction,
  deps: DependencyList
): T | undefined {
  return useMemo(() => (deps.every(match) ? callback : undefined), deps);
}
