import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LikeBufferManager } from './likeBuffer';

// Mock fetch globally
global.fetch = vi.fn();
global.navigator = { sendBeacon: vi.fn() } as unknown as Navigator;
global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
} as unknown as Storage;

// Mock window and document for event handling
Object.defineProperty(window, 'addEventListener', {
  writable: true,
  value: vi.fn(),
});

Object.defineProperty(document, 'addEventListener', {
  writable: true,
  value: vi.fn(),
});

Object.defineProperty(window, 'dispatchEvent', {
  writable: true,
  value: vi.fn(),
});

describe('LikeBufferManager', () => {
  let likeBuffer: LikeBufferManager;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    // Mock localStorage methods
    (localStorage.getItem as unknown as ReturnType<typeof vi.fn>).mockReturnValue('[]');

    likeBuffer = new LikeBufferManager();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('add', () => {
    it('should add like and trigger optimistic update', () => {
      // Given: Entry ID
      const entryId = 'test-entry';

      // When: Add like
      likeBuffer.add(entryId);

      // Then: Should dispatch optimistic update event
      expect(window.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'likeIncrement',
          detail: { entryId, increment: 1 },
        }),
      );
    });

    it('should accumulate multiple likes for same entry', () => {
      // Given: Entry ID
      const entryId = 'test-entry';

      // When: Add multiple likes
      likeBuffer.add(entryId);
      likeBuffer.add(entryId);

      // Then: Should have 2 pending likes
      expect(likeBuffer.getPendingCount()).toBe(2);
    });
  });

  describe('flush', () => {
    it('should send pending likes to server', async () => {
      // Given: Mocked successful response
      (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true, total: 5 }),
      });

      const entryId = 'test-entry';
      likeBuffer.add(entryId);

      // When: Flush manually
      await likeBuffer.flush();

      // Then: Should make API call
      expect(fetch).toHaveBeenCalledWith(
        `/api/likes/${entryId}`,
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ counts: 1 }),
        }),
      );
    });

    it('should handle rate limit response', async () => {
      // Given: Mocked rate limit response
      (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 429,
      });

      const entryId = 'test-entry';
      likeBuffer.add(entryId);

      // When: Flush manually
      await likeBuffer.flush();

      // Then: Should dispatch rate limit event
      expect(window.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'likeRateLimit',
        }),
      );
    });

    it('should save to retry queue on failure', async () => {
      // Given: Mocked failed response
      (fetch as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Network error'));

      const entryId = 'test-entry';
      likeBuffer.add(entryId);

      // When: Flush manually
      await likeBuffer.flush();

      // Then: Should save to localStorage
      expect(localStorage.setItem).toHaveBeenCalledWith('likeRetryQueue', expect.stringContaining(entryId));
    });
  });

  describe('getPendingCount', () => {
    it('should return 0 when no pending likes', () => {
      // When: Get pending count
      const count = likeBuffer.getPendingCount();

      // Then: Should return 0
      expect(count).toBe(0);
    });

    it('should return total pending likes across entries', () => {
      // Given: Multiple entries with likes
      likeBuffer.add('entry1');
      likeBuffer.add('entry1');
      likeBuffer.add('entry2');

      // When: Get pending count
      const count = likeBuffer.getPendingCount();

      // Then: Should return total count
      expect(count).toBe(3);
    });
  });

  describe('event listeners setup', () => {
    it('should setup unload event listeners', () => {
      // When: Create new instance
      new LikeBufferManager();

      // Then: Should register event listeners
      expect(window.addEventListener).toHaveBeenCalledWith('beforeunload', expect.any(Function));
      expect(document.addEventListener).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
    });
  });
});
