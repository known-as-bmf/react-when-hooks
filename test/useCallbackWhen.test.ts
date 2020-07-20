import { renderHook } from '@testing-library/react-hooks';

import { useCallbackWhen, useCallbackWhenDefined } from '../src';

const matchTrue = (arg: unknown): boolean => arg === true;

describe('useCallbackWhen', () => {
  it('renders without crashing', () => {
    const dep = false;
    const hookResult = jest.fn();

    const { result } = renderHook(() =>
      useCallbackWhen(hookResult, matchTrue, [dep])
    );

    expect(result).toBeDefined();
  });

  it('return the function only when all the deps satisfy the condition', () => {
    let dep = false;
    const hookResult = jest.fn();

    const { result, rerender } = renderHook(() =>
      useCallbackWhen(hookResult, matchTrue, [dep])
    );

    expect(result.current).toBeUndefined();

    rerender();

    expect(result.current).toBeUndefined();

    dep = true;
    rerender();

    expect(result.current).toBe(hookResult);
  });
});

describe('useCallbackWhenDefined', () => {
  it('renders without crashing', () => {
    const dep = undefined;
    const hookResult = jest.fn();

    const { result } = renderHook(() =>
      useCallbackWhenDefined(hookResult, [dep])
    );

    expect(result).toBeDefined();
  });

  it.each([false, 0, '', [], {}, NaN])(
    'return the function only when all the deps satisfy the condition',
    (value) => {
      let dep: unknown = undefined;
      const hookResult = jest.fn();

      const { result, rerender } = renderHook(() =>
        useCallbackWhenDefined(hookResult, [dep])
      );

      expect(result.current).toBeUndefined();

      rerender();

      expect(result.current).toBeUndefined();

      dep = value;
      rerender();

      expect(result.current).toBe(hookResult);
    }
  );
});
