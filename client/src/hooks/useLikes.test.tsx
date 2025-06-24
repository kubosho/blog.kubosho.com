import { act, renderHook } from '@testing-library/react';
import { Provider } from 'jotai';
import type { ReactElement, ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useLikes } from './useLikes';

// Mock the likeBuffer
vi.mock('../utils/likeBuffer', () => ({
  likeBuffer: {
    add: vi.fn(),
    getPendingCount: vi.fn(() => 0),
  },
}));

// Mock fetch
global.fetch = vi.fn();

// Mock window event methods
Object.defineProperty(window, 'addEventListener', {
  writable: true,
  value: vi.fn(),
});

Object.defineProperty(window, 'removeEventListener', {
  writable: true,
  value: vi.fn(),
});

describe.skip('useLikes', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock successful fetch response by default
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ counts: 10 }),
    });
  });

  const wrapper = ({ children }: { children: ReactNode }): ReactElement => <Provider>{children}</Provider>;

  describe('initial state', () => {
    it('should return initial count and handler', () => {
      // When: Render hook with initial count
      const { result } = renderHook(() => useLikes('test-entry', 5), { wrapper });

      // Then: Should return expected initial state
      expect(result.current.likeCount).toBe(5);
      expect(result.current.isRateLimited).toBe(false);
      expect(result.current.pendingCount).toBe(0);
      expect(typeof result.current.handleLike).toBe('function');
    });
  });

  describe('handleLike', () => {
    it('should call likeBuffer.add when not rate limited', async () => {
      // Given: Mock likeBuffer
      const { likeBuffer } = await import('../utils/likeBuffer');
      const { result } = renderHook(() => useLikes('test-entry'), { wrapper });

      // When: Handle like
      act(() => {
        result.current.handleLike();
      });

      // Then: Should call likeBuffer.add
      expect(likeBuffer.add).toHaveBeenCalledWith('test-entry');
    });

    it('should not call likeBuffer.add when rate limited', async () => {
      // Given: Mock likeBuffer and rate limited state
      const { likeBuffer } = await import('../utils/likeBuffer');
      const { result } = renderHook(() => useLikes('test-entry'), { wrapper });

      // Simulate rate limited state
      act(() => {
        // Trigger rate limit event
        const event = new CustomEvent('likeRateLimit');
        window.dispatchEvent(event);
      });

      // When: Handle like while rate limited
      act(() => {
        result.current.handleLike();
      });

      // Then: Should not call likeBuffer.add
      expect(likeBuffer.add).not.toHaveBeenCalled();
    });
  });

  describe('custom events', () => {
    it('should update count on likeIncrement event', () => {
      // Given: Hook with entry
      const { result } = renderHook(() => useLikes('test-entry', 5), { wrapper });

      // When: Dispatch increment event
      act(() => {
        const event = new CustomEvent('likeIncrement', {
          detail: { entryId: 'test-entry', increment: 2 },
        });
        window.dispatchEvent(event);
      });

      // Then: Should update like count
      expect(result.current.likeCount).toBe(7);
    });

    it('should not update count for different entry', () => {
      // Given: Hook with entry
      const { result } = renderHook(() => useLikes('test-entry', 5), { wrapper });

      // When: Dispatch increment event for different entry
      act(() => {
        const event = new CustomEvent('likeIncrement', {
          detail: { entryId: 'other-entry', increment: 2 },
        });
        window.dispatchEvent(event);
      });

      // Then: Should not update like count
      expect(result.current.likeCount).toBe(5);
    });

    it('should update to server total on likeTotalUpdate event', () => {
      // Given: Hook with entry
      const { result } = renderHook(() => useLikes('test-entry', 5), { wrapper });

      // When: Dispatch total update event
      act(() => {
        const event = new CustomEvent('likeTotalUpdate', {
          detail: { entryId: 'test-entry', total: 15 },
        });
        window.dispatchEvent(event);
      });

      // Then: Should update to server total
      expect(result.current.likeCount).toBe(15);
    });

    it('should set rate limited on likeRateLimit event', () => {
      // Given: Hook with entry
      const { result } = renderHook(() => useLikes('test-entry'), { wrapper });

      // When: Dispatch rate limit event
      act(() => {
        const event = new CustomEvent('likeRateLimit');
        window.dispatchEvent(event);
      });

      // Then: Should be rate limited
      expect(result.current.isRateLimited).toBe(true);
    });
  });

  describe('server data fetching', () => {
    it('should fetch initial count from server', async () => {
      // Given: Mock fetch response
      (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ counts: 20 }),
      });

      // When: Render hook
      renderHook(() => useLikes('test-entry'), { wrapper });

      // Then: Should call fetch
      expect(fetch).toHaveBeenCalledWith('/api/likes/test-entry');
    });

    it('should handle fetch error gracefully', async () => {
      // Given: Mock fetch error
      (fetch as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Network error'));
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // When: Render hook
      const { result } = renderHook(() => useLikes('test-entry', 5), { wrapper });

      // Then: Should maintain initial state and log error
      expect(result.current.likeCount).toBe(5);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch initial like count:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });
});
