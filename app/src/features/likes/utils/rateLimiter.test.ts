import { describe, expect, test, vi } from 'vitest';

import { checkRateLimit } from './rateLimiter';

describe('checkRateLimit', () => {
  test('should return false when rate limit is not exceeded', async () => {
    // Arrange
    const mockRateLimiter = {
      limit: vi.fn().mockResolvedValue({ success: true }),
    };

    // Act
    const response = await checkRateLimit({
      clientIp: '192.168.1.1',
      entryId: 'some-entry-id',
      rateLimiter: mockRateLimiter,
    });

    // Assert
    expect(response).toBe(false);
    expect(mockRateLimiter.limit).toHaveBeenCalledWith({
      key: JSON.stringify({ clientIp: '192.168.1.1', entryId: 'some-entry-id' }),
    });
  });

  test('should return true when rate limit is exceeded', async () => {
    // Arrange
    const mockRateLimiter = {
      limit: vi.fn().mockResolvedValue({ success: false }),
    };

    // Act
    const response = await checkRateLimit({
      clientIp: '192.168.1.1',
      entryId: 'some-entry-id',
      rateLimiter: mockRateLimiter,
    });

    // Assert
    expect(response).not.toBeNull();
    expect(response).toBe(true);
    expect(mockRateLimiter.limit).toHaveBeenCalledWith({
      key: JSON.stringify({ clientIp: '192.168.1.1', entryId: 'some-entry-id' }),
    });
  });

  test('should return false when rate limiter throws error (fail open)', async () => {
    // Arrange
    const mockRateLimiter = {
      limit: vi.fn().mockRejectedValue(new Error('Rate limiter error')),
    };
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Act
    const response = await checkRateLimit({
      clientIp: '192.168.1.1',
      entryId: 'some-entry-id',
      rateLimiter: mockRateLimiter,
    });

    // Assert
    expect(response).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Rate limit check failed:', expect.any(Error));

    // Cleanup
    consoleErrorSpy.mockRestore();
  });

  test('should handle IPv6 addresses correctly', async () => {
    // Arrange
    const mockRateLimiter = {
      limit: vi.fn().mockResolvedValue({ success: true }),
    };

    // Act
    const response = await checkRateLimit({
      clientIp: '2001:db8::1',
      entryId: 'some-entry-id',
      rateLimiter: mockRateLimiter,
    });

    // Assert
    expect(response).toBe(false);
    expect(mockRateLimiter.limit).toHaveBeenCalledWith({
      key: JSON.stringify({ clientIp: '2001:db8::1', entryId: 'some-entry-id' }),
    });
  });

  test('should create unique keys for different IPv6 addresses with same entry', async () => {
    // Arrange
    const mockRateLimiter = {
      limit: vi.fn().mockResolvedValue({ success: true }),
    };

    // Act
    await checkRateLimit({
      clientIp: '2001:db8::1',
      entryId: 'article',
      rateLimiter: mockRateLimiter,
    });
    await checkRateLimit({
      clientIp: '2001:db8::1:article',
      entryId: '',
      rateLimiter: mockRateLimiter,
    });

    // Assert
    const calls = mockRateLimiter.limit.mock.calls as Array<[{ key: string }]>;
    expect(calls[0]?.[0].key).not.toBe(calls[1]?.[0].key);
  });
});
