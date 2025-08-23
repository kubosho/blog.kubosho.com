import { describe, expect, it, vi } from 'vitest';

import { dispatchLikeIncrement, dispatchLikeTotalUpdate, dispatchRateLimitEvent } from './events';

const setupMocks = (): void => {
  Object.defineProperty(window, 'dispatchEvent', {
    writable: true,
    value: vi.fn(),
  });
};

const cleanupTest = (): void => {
  vi.resetAllMocks();
  vi.restoreAllMocks();
};

const setupTest = (): void => {
  cleanupTest();

  setupMocks();
};

describe('events', () => {
  it('should dispatch rate limit event', () => {
    // Given
    setupTest();

    // When
    dispatchRateLimitEvent();

    // Then
    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'likeRateLimit',
      }),
    );
  });

  it('should dispatch like total update event', () => {
    // Given
    setupTest();

    // When
    dispatchLikeTotalUpdate('test-entry', 15);

    // Then
    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'likeTotalUpdate',
        detail: { entryId: 'test-entry', total: 15 },
      }),
    );
  });

  it('should dispatch like increment event', () => {
    // Given
    setupTest();

    // When
    dispatchLikeIncrement('test-entry', 2);

    // Then
    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'likeIncrement',
        detail: { entryId: 'test-entry', increment: 2 },
      }),
    );
  });
});
