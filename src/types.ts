/**
 * A predicate function that dependencies must match.
 */
export type MatchFunction = (
  value: any,
  index: number,
  array: readonly any[]
) => boolean;
