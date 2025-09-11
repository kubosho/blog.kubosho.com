import { describe, expect, it, vi } from 'vitest';

import { LikeBuffer } from './buffer';

const setupMocks = (): void => {
  vi.mock('../../../../utils/sentry', () => ({
    trackInteraction: vi.fn(),
  }));

  vi.useFakeTimers();
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

  const likeBuffer = new LikeBuffer();

  return { likeBuffer };
};

describe('LikeBuffer', () => {
  describe('add', () => {
    it('accumulates multiple likes for the same entry', async () => {
      // Given
      const { likeBuffer } = await setupTest();

      // When
      likeBuffer.add('test-entry');
      likeBuffer.add('test-entry');

      // Then
      expect(likeBuffer.getPendingCount()).toBe(2);
    });

    it('schedules a flush after adding', async () => {
      // Given
      const { likeBuffer } = await setupTest();

      // When
      likeBuffer.add('test-entry');

      // Then
      expect(vi.getTimerCount()).toBeGreaterThan(0);
    });
  });

  describe('flush', () => {
    it('clears pending after flush', async () => {
      // Given
      const { likeBuffer } = await setupTest();

      // When
      likeBuffer.add('test-entry');
      likeBuffer.flush();

      // Then
      expect(likeBuffer.getPendingCount()).toBe(0);
    });
  });

  describe('notifyCounts', () => {
    it('notifies subscribers with server-confirmed counts', async () => {
      // Given
      const { likeBuffer } = await setupTest();
      const mockCallback = vi.fn();

      // When
      likeBuffer.subscribe('entry', mockCallback);
      likeBuffer.notifyCounts('entry', 42);

      // Then
      expect(mockCallback).toHaveBeenCalledWith(42);
    });
  });

  describe('automatic flush', () => {
    it('flushes automatically after interval and clears pending', async () => {
      // Given
      const { likeBuffer } = await setupTest();

      // When
      likeBuffer.add('test-entry');
      await vi.advanceTimersByTimeAsync(3001);

      // Then
      expect(likeBuffer.getPendingCount()).toBe(0);
    });

    it('does not schedule multiple flushes', async () => {
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
