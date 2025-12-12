import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useLikes } from './useLikes';

vi.mock('./likes_buffer/buffer', () => ({
  useLikeBuffer: vi.fn(() => ({
    notifyCounts: vi.fn(),
    subscribe: vi.fn(() => vi.fn()),
  })),
}));
vi.mock('./likes_buffer/internals/api', () => ({
  sendLikes: vi.fn(() => Promise.resolve({ counts: 1 })),
}));
vi.mock('./likes_buffer/internals/storage', () => ({
  clearRetryQueue: vi.fn(),
  loadRetryQueue: vi.fn(() => []),
}));

describe('useLikes', () => {
  it('should initialize with initialCounts', () => {
    // Arrange
    const { result } = renderHook(() => useLikes({ entryId: 'test', initialCounts: 5 }));

    // Assert
    expect(result.current.counts).toBe(5);
  });

  it('should increment counts on call handleLikes()', () => {
    // Arrange
    const { result } = renderHook(() => useLikes({ entryId: 'test' }));

    // Act
    act(() => {
      result.current.handleLikes();
    });

    // Assert
    expect(result.current.counts).toBe(1);
  });
});
