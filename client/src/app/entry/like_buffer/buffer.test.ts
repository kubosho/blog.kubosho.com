import { describe, expect, it, vi } from 'vitest';

import { LikeBuffer } from './buffer';

const setupMocks = (): void => {
  vi.mock('../../../app/global_object/storage', () => ({
    getDOMStorage: () => ({
      session: {
        getItem: vi.fn(() => '[]'),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      local: {} as Storage,
    }),
  }));

  vi.mock('../../../utils/sentry', () => ({
    trackInteraction: vi.fn(),
  }));

  vi.mock('./internals/api', () => ({
    sendLikes: vi.fn(),
    sendLikesBeacon: vi.fn(),
  }));

  vi.mock('./internals/events', () => ({
    dispatchLikeIncrement: vi.fn(),
    dispatchLikeTotalUpdate: vi.fn(),
    dispatchRateLimitEvent: vi.fn(),
  }));

  vi.mock('./internals/storage', () => ({
    saveToRetryQueue: vi.fn(),
    loadRetryQueue: vi.fn(() => []),
    clearRetryQueue: vi.fn(),
  }));

  vi.useFakeTimers();

  Object.defineProperty(window, 'addEventListener', {
    writable: true,
    value: vi.fn(),
  });

  Object.defineProperty(document, 'addEventListener', {
    writable: true,
    value: vi.fn(),
  });
};

const cleanupTest = (): void => {
  vi.clearAllTimers();
  vi.resetAllMocks();
  vi.restoreAllMocks();
};

const setupTest = async (): Promise<{
  likeBuffer: LikeBuffer;
}> => {
  cleanupTest();

  setupMocks();

  // Ensure loadRetryQueue returns empty by default
  const { loadRetryQueue } = await import('./internals/storage');
  (loadRetryQueue as unknown as ReturnType<typeof vi.fn>).mockReturnValue([]);

  const likeBuffer = new LikeBuffer();

  return { likeBuffer };
};

describe('LikeBuffer', () => {
  describe('add', () => {
    it('should add like and trigger optimistic update', async () => {
      // Given
      const { likeBuffer } = await setupTest();
      const { dispatchLikeIncrement } = await import('./internals/events');
      const { trackInteraction } = await import('../../../utils/sentry');

      // When
      likeBuffer.add('test-entry');

      // Then
      expect(dispatchLikeIncrement).toHaveBeenCalledWith('test-entry', 1);
      expect(trackInteraction).toHaveBeenCalledWith('like_added', 'likes', { entryId: 'test-entry' });
    });

    it('should accumulate multiple likes for same entry', async () => {
      // Given
      const { likeBuffer } = await setupTest();

      // When
      likeBuffer.add('test-entry');
      likeBuffer.add('test-entry');

      // Then
      expect(likeBuffer.getPendingCount()).toBe(2);
    });

    it('should schedule flush after adding', async () => {
      // Given
      const { likeBuffer } = await setupTest();

      // When
      likeBuffer.add('test-entry');

      // Then
      expect(vi.getTimerCount()).toBeGreaterThan(0);
    });
  });

  describe('flush', () => {
    it('should send pending likes to server', async () => {
      // Given
      const { likeBuffer } = await setupTest();
      const { sendLikes } = await import('./internals/api');
      const { dispatchLikeCountsUpdate } = await import('./internals/events');
      (sendLikes as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ total: 5 });

      // When
      likeBuffer.add('test-entry');
      await likeBuffer.flush();

      // Then
      expect(sendLikes).toHaveBeenCalledWith('test-entry', 1);
      expect(dispatchLikeCountsUpdate).toHaveBeenCalledWith('test-entry', 5);
    });

    it('should handle multiple entries', async () => {
      // Given
      const { likeBuffer } = await setupTest();
      const { sendLikes } = await import('./internals/api');

      // When
      likeBuffer.add('entry1');
      likeBuffer.add('entry1');
      likeBuffer.add('entry2');
      await likeBuffer.flush();

      // Then
      expect(sendLikes).toHaveBeenCalledWith('entry1', 2);
      expect(sendLikes).toHaveBeenCalledWith('entry2', 1);
    });

    it('should clear pending after flush', async () => {
      // Given
      const { likeBuffer } = await setupTest();

      // When
      likeBuffer.add('test-entry');
      await likeBuffer.flush();

      // Then
      expect(likeBuffer.getPendingCount()).toBe(0);
    });
  });

  describe('getPendingCount', () => {
    it('should return 0 when no pending likes', async () => {
      // Given
      const { likeBuffer } = await setupTest();

      // Then
      expect(likeBuffer.getPendingCount()).toBe(0);
    });

    it('should return total pending likes across entries', async () => {
      // Given
      const { likeBuffer } = await setupTest();

      // When
      likeBuffer.add('entry1');
      likeBuffer.add('entry1');
      likeBuffer.add('entry2');

      // Then
      expect(likeBuffer.getPendingCount()).toBe(3);
    });
  });

  describe('retry queue initialization', () => {
    it('should process retry queue on initialization', async () => {
      // Given
      await setupTest();
      const { loadRetryQueue, clearRetryQueue } = await import('./internals/storage');
      const { sendLikes } = await import('./internals/api');
      (sendLikes as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ total: 5 });
      (loadRetryQueue as unknown as ReturnType<typeof vi.fn>).mockReturnValueOnce([
        { entryId: 'retry-entry', counts: 2, timestamp: Date.now() },
      ]);

      // When
      new LikeBuffer();
      vi.advanceTimersByTime(5000);

      // Then
      expect(clearRetryQueue).toHaveBeenCalled();
      expect(sendLikes).toHaveBeenCalledWith('retry-entry', 2);
    });
  });

  describe('automatic flush', () => {
    it('should flush automatically after interval', async () => {
      // Given
      const { likeBuffer } = await setupTest();
      const { sendLikes } = await import('./internals/api');

      // When
      likeBuffer.add('test-entry');
      await vi.advanceTimersByTimeAsync(3001);

      // Then
      expect(sendLikes).toHaveBeenCalledWith('test-entry', 1);
    });

    it('should not schedule multiple flushes', async () => {
      // Given
      const { likeBuffer } = await setupTest();

      // When
      likeBuffer.add('entry1');
      likeBuffer.add('entry2');
      likeBuffer.add('entry3');

      // Then
      expect(vi.getTimerCount()).toBe(1);
    });
  });
});
