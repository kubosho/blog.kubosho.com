import { describe, expect, test } from 'vitest';

import { getClientIp } from '../../../features/likes/utils/getClientIp';

describe('getClientIp', () => {
  test('should return CF-Connecting-IP header when present', () => {
    // Arrange
    const request = new Request('https://example.com', {
      headers: {
        'CF-Connecting-IP': '203.0.113.1',
      },
    });

    // Act
    const result = getClientIp(request);

    // Assert
    expect(result).toBe('203.0.113.1');
  });

  test('should return first IP from X-Forwarded-For when CF-Connecting-IP is absent', () => {
    // Arrange
    const request = new Request('https://example.com', {
      headers: {
        'X-Forwarded-For': '192.168.1.1, 10.0.0.1, 172.16.0.1',
      },
    });

    // Act
    const result = getClientIp(request);

    // Assert
    expect(result).toBe('192.168.1.1');
  });

  test('should return single IP from X-Forwarded-For correctly', () => {
    // Arrange
    const request = new Request('https://example.com', {
      headers: {
        'X-Forwarded-For': '192.168.1.1',
      },
    });

    // Act
    const result = getClientIp(request);

    // Assert
    expect(result).toBe('192.168.1.1');
  });

  test('should trim whitespace from X-Forwarded-For IP', () => {
    // Arrange
    const request = new Request('https://example.com', {
      headers: {
        'X-Forwarded-For': '  192.168.1.1  , 10.0.0.1',
      },
    });

    // Act
    const result = getClientIp(request);

    // Assert
    expect(result).toBe('192.168.1.1');
  });

  test('should return default "unknown" when no IP headers are present', () => {
    // Arrange
    const request = new Request('https://example.com');

    // Act
    const result = getClientIp(request);

    // Assert
    expect(result).toBe('unknown');
  });

  test('should prefer CF-Connecting-IP over X-Forwarded-For', () => {
    // Arrange
    const request = new Request('https://example.com', {
      headers: {
        'CF-Connecting-IP': '203.0.113.1',
        'X-Forwarded-For': '192.168.1.1',
      },
    });

    // Act
    const result = getClientIp(request);

    // Assert
    expect(result).toBe('203.0.113.1');
  });

  test('should handle IPv6 address from CF-Connecting-IP', () => {
    // Arrange
    const request = new Request('https://example.com', {
      headers: {
        'CF-Connecting-IP': '2001:db8::1',
      },
    });

    // Act
    const result = getClientIp(request);

    // Assert
    expect(result).toBe('2001:db8::1');
  });

  test('should handle IPv6 address from X-Forwarded-For', () => {
    // Arrange
    const request = new Request('https://example.com', {
      headers: {
        'X-Forwarded-For': '2001:db8::1, 2001:db8::2',
      },
    });

    // Act
    const result = getClientIp(request);

    // Assert
    expect(result).toBe('2001:db8::1');
  });
});
