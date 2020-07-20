import { renderHook } from '@testing-library/react-hooks';

import { useLayoutEffectWhen, useLayoutEffectWhenDefined } from '../src';

const matchTrue = (arg: unknown): boolean => arg === true;

describe('useLayoutEffectWhen', () => {
  it('renders without crashing', () => {
    const dep = false;
    const cb = jest.fn();

    const { result } = renderHook(() =>
      useLayoutEffectWhen(cb, matchTrue, [dep])
    );

    expect(result).toBeDefined();
  });

  it('call the effect function only when all the deps satisfy the condition', () => {
    let dep = false;

    const effect = jest.fn();

    const { rerender } = renderHook(() =>
      useLayoutEffectWhen(effect, matchTrue, [dep])
    );

    expect(effect).not.toHaveBeenCalled();

    rerender();

    expect(effect).not.toHaveBeenCalled();

    dep = true;
    rerender();

    expect(effect).toHaveBeenCalledTimes(1);
  });

  it('call the cleanup function properly', () => {
    let dep = false;

    const cleanup = jest.fn();
    const effect = jest.fn().mockReturnValue(cleanup);

    const { rerender, unmount } = renderHook(() =>
      useLayoutEffectWhen(effect, matchTrue, [dep])
    );

    expect(cleanup).not.toHaveBeenCalled();
    expect(effect).not.toHaveBeenCalled();

    rerender();

    expect(cleanup).not.toHaveBeenCalled();
    expect(effect).not.toHaveBeenCalled();

    dep = true;
    rerender();

    expect(cleanup).not.toHaveBeenCalled();
    expect(effect).toHaveBeenCalledTimes(1);

    dep = false;
    rerender();

    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(effect).toHaveBeenCalledTimes(1);

    dep = true;
    rerender();

    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(effect).toHaveBeenCalledTimes(2);

    unmount();

    expect(cleanup).toHaveBeenCalledTimes(2);
    expect(effect).toHaveBeenCalledTimes(2);
  });
});

describe('useLayoutEffectWhenDefined', () => {
  it('renders without crashing', () => {
    const dep: boolean | undefined = undefined;
    const cb = jest.fn();

    const { result } = renderHook(() => useLayoutEffectWhenDefined(cb, [dep]));

    expect(result).toBeDefined();
  });

  it.each([false, 0, '', [], {}, NaN])(
    'call the effect function only when all the deps satisfy the condition',
    (value) => {
      let dep: unknown = undefined;

      const effect = jest.fn();

      const { rerender } = renderHook(() =>
        useLayoutEffectWhenDefined(effect, [dep])
      );

      expect(effect).not.toHaveBeenCalled();

      rerender();

      expect(effect).not.toHaveBeenCalled();

      dep = value;
      rerender();

      expect(effect).toHaveBeenCalledTimes(1);
    }
  );

  it('call the cleanup function properly', () => {
    let dep: number | undefined = undefined;

    const cleanup = jest.fn();
    const effect = jest.fn().mockReturnValue(cleanup);

    const { rerender, unmount } = renderHook(() =>
      useLayoutEffectWhenDefined(effect, [dep])
    );

    expect(cleanup).not.toHaveBeenCalled();
    expect(effect).not.toHaveBeenCalled();

    rerender();

    expect(cleanup).not.toHaveBeenCalled();
    expect(effect).not.toHaveBeenCalled();

    dep = 0;
    rerender();

    expect(cleanup).not.toHaveBeenCalled();
    expect(effect).toHaveBeenCalledTimes(1);

    dep = undefined;
    rerender();

    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(effect).toHaveBeenCalledTimes(1);

    dep = 1;
    rerender();

    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(effect).toHaveBeenCalledTimes(2);

    unmount();

    expect(cleanup).toHaveBeenCalledTimes(2);
    expect(effect).toHaveBeenCalledTimes(2);
  });
});
