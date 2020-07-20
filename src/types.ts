/**
 * A predicate function that dependencies must match.
 */
export type MatchFunction = (
  value: unknown,
  index: number,
  array: readonly unknown[]
) => boolean;
