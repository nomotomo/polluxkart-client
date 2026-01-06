import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../src/hooks/useDebounce';

// Mock timers
jest.useFakeTimers();

describe('useDebounce Hook', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  test('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  test('debounces value updates', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    expect(result.current).toBe('initial');

    // Update the value
    rerender({ value: 'updated', delay: 500 });

    // Value should not have changed yet
    expect(result.current).toBe('initial');

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Now value should be updated
    expect(result.current).toBe('updated');
  });

  test('cancels previous timer on rapid updates', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'a', delay: 500 } }
    );

    // Rapid updates
    rerender({ value: 'ab', delay: 500 });
    act(() => { jest.advanceTimersByTime(200); });
    
    rerender({ value: 'abc', delay: 500 });
    act(() => { jest.advanceTimersByTime(200); });
    
    rerender({ value: 'abcd', delay: 500 });

    // Should still be 'a' as timers keep getting reset
    expect(result.current).toBe('a');

    // Wait for full delay
    act(() => { jest.advanceTimersByTime(500); });

    // Should be final value
    expect(result.current).toBe('abcd');
  });

  test('uses custom delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 1000 } }
    );

    rerender({ value: 'updated', delay: 1000 });

    // At 500ms, should still be initial
    act(() => { jest.advanceTimersByTime(500); });
    expect(result.current).toBe('initial');

    // At 1000ms, should be updated
    act(() => { jest.advanceTimersByTime(500); });
    expect(result.current).toBe('updated');
  });
});
