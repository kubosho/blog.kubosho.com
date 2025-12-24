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
      // Arrange
      const { mockSessionStorage } = await setupTest();
      (mockSessionStorage.getItem as unknown as ReturnType<typeof vi.fn>).mockReturnValue('[]');

      // Act
      saveToRetryQueue('test-entry', 3);

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const mockSetItem = vi.mocked(mockSessionStorage.setItem);
      expect(mockSetItem).toHaveBeenCalledWith(LIKE_SEND_RETRY_QUEUE_KEY, expect.stringContaining('test-entry'));
      expect(mockSetItem).toHaveBeenCalledWith(LIKE_SEND_RETRY_QUEUE_KEY, expect.stringContaining('"increment":3'));
    });

    it('should append to existing queue', async () => {
      // Arrange
      const { mockSessionStorage } = await setupTest();
      const existingQueue: RetryQueueItem[] = [{ entryId: 'existing-entry', increment: 1, timestamp: Date.now() }];
      (mockSessionStorage.getItem as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
        JSON.stringify(existingQueue),
      );

      // Act
      void saveToRetryQueue('new-entry', 2);

      // Assert
      const savedData = (mockSessionStorage.setItem as unknown as ReturnType<typeof vi.fn>).mock
        .calls[0]?.[1] as string;
      const parsedData = JSON.parse(savedData) as RetryQueueItem[];
      expect(parsedData).toHaveLength(2);
      expect(parsedData[0]?.entryId).toBe('existing-entry');
      expect(parsedData[1]?.entryId).toBe('new-entry');
    });

    it('should handle storage errors gracefully', async () => {
      // Arrange
      const { mockSessionStorage } = await setupTest();
      (mockSessionStorage.getItem as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => {
        throw new Error('Storage error');
      });

      // Act / Assert
      expect(() => saveToRetryQueue('test-entry', 1)).not.toThrow();
    });
  });

  describe('loadRetryQueue', () => {
    it('should load items from retry queue', async () => {
      // Arrange
      const { mockSessionStorage } = await setupTest();
      const queue: RetryQueueItem[] = [
        { entryId: 'entry-1', increment: 1, timestamp: Date.now() - 1000 },
        { entryId: 'entry-2', increment: 2, timestamp: Date.now() },
      ];
      (mockSessionStorage.getItem as unknown as ReturnType<typeof vi.fn>).mockReturnValue(JSON.stringify(queue));

      // Act
      const result = loadRetryQueue();

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0]?.entryId).toBe('entry-1');
      expect(result[1]?.entryId).toBe('entry-2');
    });

    it('should return empty array when no items in queue', async () => {
      // Arrange
      const { mockSessionStorage } = await setupTest();
      (mockSessionStorage.getItem as unknown as ReturnType<typeof vi.fn>).mockReturnValue('[]');

      // Act
      const result = loadRetryQueue();

      // Assert
      expect(result).toEqual([]);
    });

    it('should handle storage errors gracefully', async () => {
      // Arrange
      const { mockSessionStorage } = await setupTest();
      (mockSessionStorage.getItem as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => {
        throw new Error('Storage error');
      });

      // Act
      const result = loadRetryQueue();

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('clearRetryQueue', () => {
    it('should clear the retry queue', async () => {
      // Arrange
      const { mockSessionStorage } = await setupTest();

      // Act
      clearRetryQueue();

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const mockSetItem = vi.mocked(mockSessionStorage.setItem);
      expect(mockSetItem).toHaveBeenCalledWith(LIKE_SEND_RETRY_QUEUE_KEY, '[]');
    });

    it('should handle storage errors gracefully', async () => {
      // Arrange
      const { mockSessionStorage } = await setupTest();
      (mockSessionStorage.setItem as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => {
        throw new Error('Storage error');
      });

      // Act / Assert
      expect(() => clearRetryQueue()).not.toThrow();
    });
  });
});
