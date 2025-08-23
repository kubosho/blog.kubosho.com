import { describe, expect, it, vi } from 'vitest';

import { sendLikes, sendLikesBeacon } from './api';

const setupMocks = (): void => {
  global.fetch = vi.fn();
  global.navigator = { sendBeacon: vi.fn() } as unknown as Navigator;

  vi.mock('./storage', () => ({
    saveToRetryQueue: vi.fn(),
  }));

  vi.mock('./events', () => ({
    dispatchRateLimitEvent: vi.fn(),
  }));
};

const cleanupTest = (): void => {
  vi.resetAllMocks();
  vi.restoreAllMocks();
};

const setupTest = (): void => {
  cleanupTest();

  setupMocks();
};

describe('api', () => {
  describe('sendLikes', () => {
    it('should send likes and return total on success', async () => {
      // Given
      setupTest();
      (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ total: 10 }),
      });

      // When
      const result = await sendLikes('test-entry', 3);

      // Then
      expect(fetch).toHaveBeenCalledWith(
        '/api/likes/test-entry',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ counts: 3 }),
        }),
      );
      expect(result).toEqual({ total: 10 });
    });

    it('should handle rate limit response', async () => {
      // Given
      setupTest();
      const { dispatchRateLimitEvent } = await import('./events');
      (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 429,
      });

      // When
      const result = await sendLikes('test-entry', 1);

      // Then
      expect(dispatchRateLimitEvent).toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should handle network errors', async () => {
      // Given
      setupTest();
      (fetch as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Network error'));

      // When
      const result = await sendLikes('test-entry', 2);

      // Then
      const { saveToRetryQueue } = await import('./storage');
      expect(saveToRetryQueue).toHaveBeenCalledWith('test-entry', 2);
      expect(result).toBeNull();
    });

    it('should handle non-ok (status code 500) responses', async () => {
      // Given
      setupTest();
      (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      // When
      const result = await sendLikes('test-entry', 1);

      // Then
      const { saveToRetryQueue } = await import('./storage');
      expect(saveToRetryQueue).toHaveBeenCalledWith('test-entry', 1);
      expect(result).toBeNull();
    });
  });

  describe('sendLikesBeacon', () => {
    it('should send likes using sendBeacon', () => {
      // Given
      setupTest();

      // When
      sendLikesBeacon('test-entry', 5);

      // Then
      expect(navigator.sendBeacon).toHaveBeenCalledWith('/api/likes/test-entry', expect.any(FormData));
      const formData = (navigator.sendBeacon as unknown as ReturnType<typeof vi.fn>).mock.calls[0]?.[1];
      expect(formData?.get('counts')).toBe('5');
    });
  });
});
