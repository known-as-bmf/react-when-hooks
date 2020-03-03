A small toolkit providing hooks similar to `useEffect`, `useLayoutEffect`, `useMemo` and `useCallback` that can be triggered only when the provided dependency array match a predicate.

[![Build Status](https://travis-ci.org/known-as-bmf/react-when-hooks.svg?branch=master)](https://travis-ci.org/known-as-bmf/react-when-hooks)
[![Known Vulnerabilities](https://snyk.io//test/github/known-as-bmf/react-when-hooks/badge.svg?targetFile=package.json)](https://snyk.io//test/github/known-as-bmf/react-when-hooks?targetFile=package.json)

## Installation

`npm install --save @known-as-bmf/react-when-hooks`

You also need react (>= 16.8) installed in your project.

## What is this about ?

For this section, we will consider that "defined" is equivalent to "not `null` or `undefined`".

The most common use case is preventing execution until all dependencies are defined.

Take this example:

```ts
useEffect(() => {
  fetchBackendData(user.id);
}, [user]);
```

In the code above, an error will be thrown if `user` is not defined.

We could fix it by doing something like:

```ts
useEffect(() => {
  if (!user) return;
  fetchBackendData(user.id);
}, [user]);
```

It can become quite cumbersome when we have multiple dependencies.

```ts
useEffect(() => {
  if (!database) return;
  if (!user) return;
  if (!accessRights) return;
  database.fetchBackendData(user.id, accessRights);
}, [database, user, accessRights]);
```

Using this library, you can do:

```ts
useEffectWhenDefined(() => {
  //database, user and accessRights are guaranteed to be defined here.
  database.fetchBackendData(user.id, accessRights);
}, [database, user, accessRights]);
```

This `useEffect` will only be triggered when all its dependencies are defined.

**WhenDefined** wrappers are available for `useEffect`, `useLayoutEffect`, `useMemo` and `useCallback`.

`useMemo` and `useCallback` will return `undefined` until all dependencies are defined.

You can also customize the predicate used to decide if the hook should run.

## API

```ts
/**
 * A predicate function that dependencies must match.
 */
type MatchFunction = (
  value: any,
  index: number,
  array: readonly any[]
) => boolean;
```

```ts
/**
 * `useEffect` with a predicate that all dependencies must match in order to be triggered.
 * @param effect The effect function to call when all the dependencies match the given predicate.
 * @param match The predicate function that all dependencies must match.
 * @param deps The dependency array.
 */
function useEffectWhen(
  effect: EffectCallback,
  match: MatchFunction,
  deps: DependencyList
): void;
/**
 * `useLayoutEffect` with a predicate that all dependencies must match in order to be triggered.
 * @param effect The effect function to call when all the dependencies match the given predicate.
 * @param match The predicate function that all dependencies must match.
 * @param deps The dependency array.
 */
function useLayoutEffectWhen(
  effect: EffectCallback,
  match: MatchFunction,
  deps: DependencyList
): void;
```

```ts
/**
 * `useMemo` with a predicate that all dependencies must match in order to generate the value.
 * @param factory The value generating function to call when all the dependencies match the given predicate.
 * @param match The predicate function that all dependencies must match.
 * @param deps The dependency array.
 *
 * @returns The value generated by the factory if all dependencies match the predicate, `undefined` otherwise.
 */
function useMemoWhen<T extends any>(
  factory: () => T,
  match: MatchFunction,
  deps: DependencyList
): T | undefined;
```

```ts
/**
 * `useCallback` with a predicate that all dependencies must match in order to generate the callback.
 * @param callback The callback to create when all the dependencies match the given predicate.
 * @param match The predicate function that all dependencies must match.
 * @param deps The dependency array.
 *
 * @returns The callback if all dependencies match the predicate, `undefined` otherwise.
 */
function useCallbackWhen<T extends (...args: any[]) => any>(
  callback: T,
  match: MatchFunction,
  deps: DependencyList
): T | undefined;
```

```ts
/**
 * Shortcut for `useEffectWhen(effect, isDefined, deps)`
 * @param effect The effect function to call when all the dependencies are defined.
 * @param deps The dependency array.
 */
function useEffectWhenDefined(
  effect: EffectCallback,
  deps: DependencyList
): void;
/**
 * Shortcut for `useLayoutEffectWhen(effect, isDefined, deps)`
 * @param effect The effect function to call when all the dependencies are defined.
 * @param deps The dependency array.
 */
function useLayoutEffectWhenDefined(
  effect: EffectCallback,
  deps: DependencyList
): void;
```

```ts
/**
 * Shortcut for `useMemoWhen(factory, isDefined, deps)`
 * @param factory The value generating function to call when all the dependencies are defined.
 * @param deps The dependency array.
 *
 * @returns The value generated by the factory if all dependencies are defined, `undefined` otherwise.
 */
function useMemoWhenDefined<T extends any>(
  factory: () => T,
  deps: DependencyList
): T | undefined;
```

```ts
/**
 * Shortcut for `useCallbackWhen(callback, isDefined, deps)`
 * @param callback The callback to create when all the dependencies are defined.
 * @param deps The dependency array.
 *
 * @returns The callback if all dependencies are defined, `undefined` otherwise.
 */
function useCallbackWhenDefined<T extends (...args: any[]) => any>(
  callback: T,
  deps: DependencyList
): T | undefined;
```
