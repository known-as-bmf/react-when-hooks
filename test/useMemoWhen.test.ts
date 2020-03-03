import { renderHook } from '@testing-library/react-hooks';

import { useMemoWhen, useMemoWhenDefined } from '../src';

const matchTrue = (arg: boolean): boolean => arg === true;

describe('useMemoWhen', () => {
  it('renders without crashing', () => {
    const dep = false;
    const hookResult = 'test';
    const factory = jest.fn().mockReturnValue(hookResult);

    const { result } = renderHook(() => useMemoWhen(factory, matchTrue, [dep]));

    expect(result).toBeDefined();
  });

  it('call the factory function only when all the deps satisfy the condition', () => {
    let dep = false;
    const hookResult = 'test';
    const factory = jest.fn().mockReturnValue(hookResult);

    const { result, rerender } = renderHook(() =>
      useMemoWhen(factory, matchTrue, [dep])
    );

    expect(factory).not.toHaveBeenCalled();
    expect(result.current).toBeUndefined();

    rerender();

    expect(factory).not.toHaveBeenCalled();
    expect(result.current).toBeUndefined();

    dep = true;
    rerender();

    expect(factory).toHaveBeenCalledTimes(1);
    expect(result.current).toBe(hookResult);
  });
});

describe('useMemoWhenDefined', () => {
  it('renders without crashing', () => {
    const dep = undefined;
    const hookResult = 'test';
    const factory = jest.fn().mockReturnValue(hookResult);

    const { result } = renderHook(() => useMemoWhenDefined(factory, [dep]));

    expect(result).toBeDefined();
  });

  it.each([false, 0, '', [], {}, NaN])(
    'call the factory function only when all the deps satisfy the condition',
    value => {
      let dep: any = undefined;
      const hookResult = 'test';
      const factory = jest.fn().mockReturnValue(hookResult);

      const { result, rerender } = renderHook(() =>
        useMemoWhenDefined(factory, [dep])
      );

      expect(factory).not.toHaveBeenCalled();
      expect(result.current).toBeUndefined();

      rerender();

      expect(factory).not.toHaveBeenCalled();
      expect(result.current).toBeUndefined();

      dep = value;
      rerender();

      expect(factory).toHaveBeenCalledTimes(1);
      expect(result.current).toBe(hookResult);
    }
  );
});
