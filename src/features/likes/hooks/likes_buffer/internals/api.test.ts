import { describe, expect, it, vi } from 'vitest';

import { sendLikes } from './api';

const setupMocks = (): void => {
  global.fetch = vi.fn();
  global.navigator = { sendBeacon: vi.fn() } as unknown as Navigator;

  vi.mock('./storage', () => ({
    saveToRetryQueue: vi.fn(),
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
    it('should send likes and return counts on success', async () => {
      // Given
      setupTest();
      const entryId = 'test-entry';
      (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            id: entryId,
            counts: 10,
          }),
      });

      // When
      const result = await sendLikes('test-entry', 3);

      // Then
      expect(fetch).toHaveBeenCalledWith(
        '/api/likes/test-entry',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            counts: 3,
          }),
        }),
      );
      expect(result).toEqual({
        id: entryId,
        counts: 10,
      });
    });

    it('should handle rate limit response', async () => {
      // Given
      setupTest();
      (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 429,
      });

      // When
      const result = await sendLikes('test-entry', 1);

      // Then
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
});
