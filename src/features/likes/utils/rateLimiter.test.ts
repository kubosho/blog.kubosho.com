import { describe, expect, test, vi } from 'vitest';

import { checkRateLimit } from './rateLimiter';

describe('checkRateLimit', () => {
  test('should return null when rate limit is not exceeded', async () => {
    // Arrange
    const mockRateLimiter = {
      limit: vi.fn().mockResolvedValue({ success: true }),
    };

    // Act
    const response = await checkRateLimit({ entryId: 'some-entry-id', rateLimiter: mockRateLimiter });

    // Assert
    expect(response).toBeNull();
    expect(mockRateLimiter.limit).toHaveBeenCalledWith({ key: 'some-entry-id' });
  });

  test('should return error response when rate limit is exceeded', async () => {
    // Arrange
    const mockRateLimiter = {
      limit: vi.fn().mockResolvedValue({ success: false }),
    };

    // Act
    const response = await checkRateLimit({ entryId: 'some-entry-id', rateLimiter: mockRateLimiter });

    // Assert
    expect(response).not.toBeNull();
    expect(response?.status).toBe(429);
    expect(mockRateLimiter.limit).toHaveBeenCalledWith({ key: 'some-entry-id' });
  });

  test('should return null when rate limiter throws error (fail open)', async () => {
    // Arrange
    const mockRateLimiter = {
      limit: vi.fn().mockRejectedValue(new Error('Rate limiter error')),
    };
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Act
    const response = await checkRateLimit({ entryId: 'some-entry-id', rateLimiter: mockRateLimiter });

    // Assert
    expect(response).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Rate limit check failed:', expect.any(Error));

    // Cleanup
    consoleErrorSpy.mockRestore();
  });
});
