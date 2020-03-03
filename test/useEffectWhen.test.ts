import { renderHook } from '@testing-library/react-hooks';

import { useEffectWhen, useEffectWhenDefined } from '../src';

const matchTrue = (arg: boolean): boolean => arg === true;

describe('useEffectWhen', () => {
  it('renders without crashing', () => {
    const dep = false;
    const cb = jest.fn();

    const { result } = renderHook(() => useEffectWhen(cb, matchTrue, [dep]));

    expect(result).toBeDefined();
  });

  it('call the effect function only when all the deps satisfy the condition', () => {
    let dep = false;

    const effect = jest.fn();

    const { rerender } = renderHook(() =>
      useEffectWhen(effect, matchTrue, [dep])
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
      useEffectWhen(effect, matchTrue, [dep])
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

describe('useEffectWhenDefined', () => {
  it('renders without crashing', () => {
    const dep: boolean | undefined = undefined;
    const cb = jest.fn();

    const { result } = renderHook(() => useEffectWhenDefined(cb, [dep]));

    expect(result).toBeDefined();
  });

  it.each([false, 0, '', [], {}, NaN])(
    'call the effect function only when all the deps satisfy the condition',
    value => {
      let dep: any = undefined;

      const effect = jest.fn();

      const { rerender } = renderHook(() =>
        useEffectWhenDefined(effect, [dep])
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
      useEffectWhenDefined(effect, [dep])
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
