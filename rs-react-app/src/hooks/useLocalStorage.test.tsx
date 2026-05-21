import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  const key = 'test-key';
  const initialValue = { name: 'test', value: 123 };

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('returns initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage(key, initialValue));

    expect(result.current[0]).toEqual(initialValue);
  });

  it('reads existing value from localStorage on mount', () => {
    const storedData = { name: 'saved', value: 456 };
    localStorage.setItem(key, JSON.stringify(storedData));

    const { result } = renderHook(() => useLocalStorage(key, initialValue));

    expect(result.current[0]).toEqual(storedData);
  });

  it('updates value and saves to localStorage when setValue is called', () => {
    const { result } = renderHook(() => useLocalStorage(key, initialValue));
    const newValue = { name: 'updated', value: 789 };

    act(() => {
      result.current[1](newValue);
    });

    expect(result.current[0]).toEqual(newValue);
    expect(localStorage.getItem(key)).toBe(JSON.stringify(newValue));
  });

  it('handles JSON parse error gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem(key, 'invalid-json');

    const { result } = renderHook(() => useLocalStorage(key, initialValue));

    expect(result.current[0]).toEqual(initialValue);
    consoleSpy.mockRestore();
  });

  it('handles localStorage setItem error gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new Error('Storage full');
    });

    const { result } = renderHook(() => useLocalStorage(key, initialValue));
    const newValue = { name: 'error', value: 999 };

    act(() => {
      result.current[1](newValue);
    });

    expect(result.current[0]).toEqual(newValue);
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
    vi.restoreAllMocks();
  });

  it('works with primitive values (string)', () => {
    const { result } = renderHook(() => useLocalStorage('string-key', 'default'));

    act(() => {
      result.current[1]('new-string');
    });

    expect(result.current[0]).toBe('new-string');
    expect(localStorage.getItem('string-key')).toBe(JSON.stringify('new-string'));
  });

  it('works with primitive values (number)', () => {
    const { result } = renderHook(() => useLocalStorage('number-key', 0));

    act(() => {
      result.current[1](42);
    });

    expect(result.current[0]).toBe(42);
    expect(localStorage.getItem('number-key')).toBe('42');
  });

  it('works with array values', () => {
    const initialArray = [1, 2, 3];
    const { result } = renderHook(() => useLocalStorage('array-key', initialArray));
    const newArray = [4, 5, 6];

    act(() => {
      result.current[1](newArray);
    });

    expect(result.current[0]).toEqual(newArray);
    expect(JSON.parse(localStorage.getItem('array-key')!)).toEqual(newArray);
  });

  it('preserves value across multiple hooks with same key', () => {
    const { result: result1 } = renderHook(() => useLocalStorage('shared-key', initialValue));
    
    act(() => {
      result1.current[1]({ name: 'shared', value: 999 });
    });

    const { result: result2 } = renderHook(() => useLocalStorage('shared-key', initialValue));
    
    expect(result2.current[0]).toEqual({ name: 'shared', value: 999 });
  });
});