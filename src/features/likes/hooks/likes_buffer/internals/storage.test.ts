import { describe, expect, it, vi } from 'vitest';

import type { DOMStorageLike } from '../../../../../utils/global_object/domStorageLike';
import { clearRetryQueue, loadRetryQueue, saveToRetryQueue } from './storage';
import type { RetryQueueItem } from './types';
import { LIKE_SEND_RETRY_QUEUE_KEY } from './types';

const setupMocks = (): void => {
  vi.mock('../../../../../utils/global_object/storage', () => {
    const mockSessionStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    return {
      getDOMStorage: () => ({
        session: mockSessionStorage,
      }),
    };
  });
};

const getMockSessionStorage = async (): Promise<DOMStorageLike> => {
  const { getDOMStorage } = await import('../../../../../utils/global_object/storage');
  const mockSessionStorage = getDOMStorage().session;

  return mockSessionStorage;
};

const cleanupTest = (): void => {
  vi.resetAllMocks();
  vi.restoreAllMocks();
};

const setupTest = async (): Promise<{ mockSessionStorage: DOMStorageLike }> => {
  cleanupTest();

  setupMocks();

  return { mockSessionStorage: await getMockSessionStorage() };
};

describe('storage', () => {
  describe('saveToRetryQueue', () => {
    it('should save failed request to retry queue', async () => {
      // Given
      const { mockSessionStorage } = await setupTest();
      (mockSessionStorage.getItem as unknown as ReturnType<typeof vi.fn>).mockReturnValue('[]');

      // When
      saveToRetryQueue('test-entry', 3);

      // Then
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        LIKE_SEND_RETRY_QUEUE_KEY,
        expect.stringContaining('test-entry'),
      );
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        LIKE_SEND_RETRY_QUEUE_KEY,
        expect.stringContaining('"counts":3'),
      );
    });

    it('should append to existing queue', async () => {
      // Given
      const { mockSessionStorage } = await setupTest();
      const existingQueue: RetryQueueItem[] = [{ entryId: 'existing-entry', counts: 1, timestamp: Date.now() }];
      (mockSessionStorage.getItem as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
        JSON.stringify(existingQueue),
      );

      // When
      saveToRetryQueue('new-entry', 2);

      // Then
      const savedData = (mockSessionStorage.setItem as unknown as ReturnType<typeof vi.fn>).mock.calls[0]?.[1];
      const parsedData = savedData ? JSON.parse(savedData) : [];
      expect(parsedData).toHaveLength(2);
      expect(parsedData[0]?.entryId).toBe('existing-entry');
      expect(parsedData[1]?.entryId).toBe('new-entry');
    });

    it('should handle storage errors gracefully', async () => {
      // Given
      const { mockSessionStorage } = await setupTest();
      (mockSessionStorage.getItem as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => {
        throw new Error('Storage error');
      });

      // When / Then
      expect(() => saveToRetryQueue('test-entry', 1)).not.toThrow();
    });
  });

  describe('loadRetryQueue', () => {
    it('should load items from retry queue', async () => {
      // Given
      const { mockSessionStorage } = await setupTest();
      const queue: RetryQueueItem[] = [
        { entryId: 'entry-1', counts: 1, timestamp: Date.now() - 1000 },
        { entryId: 'entry-2', counts: 2, timestamp: Date.now() },
      ];
      (mockSessionStorage.getItem as unknown as ReturnType<typeof vi.fn>).mockReturnValue(JSON.stringify(queue));

      // When
      const result = loadRetryQueue();

      // Then
      expect(result).toHaveLength(2);
      expect(result[0]?.entryId).toBe('entry-1');
      expect(result[1]?.entryId).toBe('entry-2');
    });

    it('should return empty array when no items in queue', async () => {
      // Given
      const { mockSessionStorage } = await setupTest();
      (mockSessionStorage.getItem as unknown as ReturnType<typeof vi.fn>).mockReturnValue('[]');

      // When
      const result = loadRetryQueue();

      // Then
      expect(result).toEqual([]);
    });

    it('should handle storage errors gracefully', async () => {
      // Given
      const { mockSessionStorage } = await setupTest();
      (mockSessionStorage.getItem as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => {
        throw new Error('Storage error');
      });

      // When
      const result = loadRetryQueue();

      // Then
      expect(result).toEqual([]);
    });
  });

  describe('clearRetryQueue', () => {
    it('should clear the retry queue', async () => {
      // Given
      const { mockSessionStorage } = await setupTest();

      // When
      clearRetryQueue();

      // Then
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(LIKE_SEND_RETRY_QUEUE_KEY, '[]');
    });

    it('should handle storage errors gracefully', async () => {
      // Given
      const { mockSessionStorage } = await setupTest();
      (mockSessionStorage.setItem as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => {
        throw new Error('Storage error');
      });

      // When / Then
      expect(() => clearRetryQueue()).not.toThrow();
    });
  });
});
