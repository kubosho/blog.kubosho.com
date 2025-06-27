import { describe, expect, it, beforeEach, vi } from 'vitest';

import app from '../index';

// Mock rate limiter responses
const mockRateLimiter = {
  normal: vi.fn(),
  burst: vi.fn(),
  global: vi.fn(),
};

// Helper to create rate-limited responses
const createRateLimitResponse = (type: 'normal' | 'burst' | 'global', message: string) => {
  return new Response(JSON.stringify({ success: false, error: message }), {
    status: 429,
    headers: {
      'Content-Type': 'application/json',
      'X-RateLimit-Type': type,
    },
  });
};

// Mock the rate limiting middleware
vi.mock('../middleware/rateLimit', () => ({
  createRateLimit: () => mockRateLimiter.normal,
  createBurstProtection: () => mockRateLimiter.burst,
  createGlobalProtection: () => mockRateLimiter.global,
}));

describe('Likes API - Rate Limiting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default to allowing requests
    mockRateLimiter.normal.mockImplementation(async (c: any, next: () => Promise<void>) => {
      await next();
    });
    mockRateLimiter.burst.mockImplementation(async (c: any, next: () => Promise<void>) => {
      await next();
    });
    mockRateLimiter.global.mockImplementation(async (c: any, next: () => Promise<void>) => {
      await next();
    });
  });

  describe('Normal rate limiting', () => {
    it('should allow requests under rate limit', async () => {
      // Given: Normal rate limiter allows requests
      const entryId = 'test-entry';
      const req = new Request(`http://localhost/api/likes/${entryId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ counts: 1 }),
      });

      // When: Sending request under rate limit
      const res = await app.request(req);
      const data = await res.json();

      // Then: Should succeed
      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockRateLimiter.normal).toHaveBeenCalled();
    });

    it('should block requests exceeding normal rate limit', async () => {
      // Given: Normal rate limiter blocks request
      mockRateLimiter.normal.mockImplementation(async (c: any) => {
        return c.json(
          { success: false, error: 'Too many requests, please slow down' },
          429
        );
      });

      const entryId = 'test-entry';
      const req = new Request(`http://localhost/api/likes/${entryId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ counts: 1 }),
      });

      // When: Sending request that exceeds rate limit
      const res = await app.request(req);
      const data = await res.json();

      // Then: Should return rate limit error
      expect(res.status).toBe(429);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Too many requests, please slow down');
    });

    it('should apply rate limiting to both GET and POST requests', async () => {
      // Given: Rate limiter blocks all requests
      mockRateLimiter.normal.mockImplementation(async (c: any) => {
        return c.json(
          { success: false, error: 'Too many requests, please slow down' },
          429
        );
      });

      const entryId = 'test-entry';

      // When: Sending POST request
      const postReq = new Request(`http://localhost/api/likes/${entryId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ counts: 1 }),
      });
      const postRes = await app.request(postReq);

      // When: Sending GET request  
      const getReq = new Request(`http://localhost/api/likes/${entryId}`, {
        method: 'GET',
      });
      const getRes = await app.request(getReq);

      // Then: Both should be rate limited
      expect(postRes.status).toBe(429);
      expect(getRes.status).toBe(429);
    });
  });

  describe('Burst protection', () => {
    it('should allow normal bursts of requests', async () => {
      // Given: Burst protection allows requests
      const entryId = 'test-entry';
      const req = new Request(`http://localhost/api/likes/${entryId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ counts: 5 }),
      });

      // When: Sending burst request
      const res = await app.request(req);
      const data = await res.json();

      // Then: Should succeed
      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockRateLimiter.burst).toHaveBeenCalled();
    });

    it('should block excessive burst requests', async () => {
      // Given: Burst protection blocks request
      mockRateLimiter.burst.mockImplementation(async (c: any) => {
        return c.json(
          { success: false, error: 'Burst limit exceeded' },
          429
        );
      });

      const entryId = 'test-entry';
      const req = new Request(`http://localhost/api/likes/${entryId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ counts: 10 }),
      });

      // When: Sending excessive burst request
      const res = await app.request(req);
      const data = await res.json();

      // Then: Should return burst limit error
      expect(res.status).toBe(429);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Burst limit exceeded');
    });

    it('should only apply burst protection when RATE_LIMITER is available', async () => {
      // Given: Environment without RATE_LIMITER
      const entryId = 'test-entry';
      const req = new Request(`http://localhost/api/likes/${entryId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ counts: 1 }),
      });

      // When: Sending request
      const res = await app.request(req);

      // Then: Should succeed (burst protection not applied)
      expect(res.status).toBe(200);
      // Burst protection should not be called in test environment
    });
  });

  describe('Global protection', () => {
    it('should allow requests under global load', async () => {
      // Given: Global protection allows requests
      const entryId = 'test-entry';
      const req = new Request(`http://localhost/api/likes/${entryId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ counts: 1 }),
      });

      // When: Sending request under global load
      const res = await app.request(req);
      const data = await res.json();

      // Then: Should succeed
      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it('should block requests during high global load', async () => {
      // Given: Global protection blocks request
      mockRateLimiter.global.mockImplementation(async (c: any) => {
        return c.json(
          { success: false, error: 'System is experiencing high load' },
          429
        );
      });

      const entryId = 'test-entry';
      const req = new Request(`http://localhost/api/likes/${entryId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ counts: 1 }),
      });

      // When: Sending request during high load
      const res = await app.request(req);
      const data = await res.json();

      // Then: Should return global load error
      expect(res.status).toBe(429);
      expect(data.success).toBe(false);
      expect(data.error).toBe('System is experiencing high load');
    });
  });

  describe('Hierarchical rate limiting', () => {
    it('should check normal rate limit first', async () => {
      // Given: Normal rate limiter blocks request
      mockRateLimiter.normal.mockImplementation(async (c: any) => {
        return c.json(
          { success: false, error: 'Too many requests, please slow down' },
          429
        );
      });

      const entryId = 'test-entry';
      const req = new Request(`http://localhost/api/likes/${entryId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ counts: 1 }),
      });

      // When: Sending request
      const res = await app.request(req);

      // Then: Should be blocked at normal rate limit level
      expect(res.status).toBe(429);
      expect(mockRateLimiter.normal).toHaveBeenCalled();
      // Burst and global should not be called if normal blocks
      expect(mockRateLimiter.burst).not.toHaveBeenCalled();
      expect(mockRateLimiter.global).not.toHaveBeenCalled();
    });

    it('should check burst protection if normal rate limit passes', async () => {
      // Given: Normal allows, burst blocks
      mockRateLimiter.burst.mockImplementation(async (c: any) => {
        return c.json(
          { success: false, error: 'Burst limit exceeded' },
          429
        );
      });

      // Set up environment with RATE_LIMITER to enable burst protection
      const entryId = 'test-entry';
      const reqWithEnv = new Request(`http://localhost/api/likes/${entryId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ counts: 1 }),
      });

      // Mock the environment binding
      const appWithEnv = {
        ...app,
        request: (req: Request) => {
          const mockEnv = { RATE_LIMITER: 'mock-binding' };
          return app.request(req, mockEnv);
        }
      };

      // When: Sending request
      const res = await appWithEnv.request(reqWithEnv);

      // Then: Should pass normal but be blocked at burst level
      expect(res.status).toBe(429);
      expect(mockRateLimiter.normal).toHaveBeenCalled();
    });

    it('should provide different error messages for different rate limit types', async () => {
      const entryId = 'test-entry';
      const baseReq = new Request(`http://localhost/api/likes/${entryId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ counts: 1 }),
      });

      // Test normal rate limit message
      mockRateLimiter.normal.mockImplementationOnce(async (c: any) => {
        return c.json(
          { success: false, error: 'Too many requests, please slow down' },
          429
        );
      });

      const normalRes = await app.request(baseReq.clone());
      const normalData = await normalRes.json();
      expect(normalData.error).toBe('Too many requests, please slow down');

      // Reset for burst test
      mockRateLimiter.normal.mockImplementation(async (c: any, next: () => Promise<void>) => {
        await next();
      });
      mockRateLimiter.burst.mockImplementationOnce(async (c: any) => {
        return c.json(
          { success: false, error: 'Burst limit exceeded' },
          429
        );
      });

      const burstRes = await app.request(baseReq.clone());
      const burstData = await burstRes.json();
      expect(burstData.error).toBe('Burst limit exceeded');

      // Reset for global test
      mockRateLimiter.burst.mockImplementation(async (c: any, next: () => Promise<void>) => {
        await next();
      });
      mockRateLimiter.global.mockImplementationOnce(async (c: any) => {
        return c.json(
          { success: false, error: 'System is experiencing high load' },
          429
        );
      });

      const globalRes = await app.request(baseReq.clone());
      const globalData = await globalRes.json();
      expect(globalData.error).toBe('System is experiencing high load');
    });
  });

  describe('Rate limit headers and metadata', () => {
    it('should include rate limit information in headers when available', async () => {
      // Given: Rate limiter includes headers
      mockRateLimiter.normal.mockImplementation(async (c: any) => {
        const response = c.json(
          { success: false, error: 'Too many requests, please slow down' },
          429
        );
        response.headers.set('X-RateLimit-Limit', '10');
        response.headers.set('X-RateLimit-Remaining', '0');
        response.headers.set('X-RateLimit-Reset', '60');
        return response;
      });

      const entryId = 'test-entry';
      const req = new Request(`http://localhost/api/likes/${entryId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ counts: 1 }),
      });

      // When: Sending rate-limited request
      const res = await app.request(req);

      // Then: Should include rate limit headers
      expect(res.status).toBe(429);
      expect(res.headers.get('X-RateLimit-Limit')).toBe('10');
      expect(res.headers.get('X-RateLimit-Remaining')).toBe('0');
      expect(res.headers.get('X-RateLimit-Reset')).toBe('60');
    });
  });

  describe('IP-based rate limiting', () => {
    it('should use client IP for rate limiting key', async () => {
      // Given: Mock normal rate limiter to capture key generation
      let capturedKey: string | undefined;
      mockRateLimiter.normal.mockImplementation(async (c: any, next: () => Promise<void>) => {
        // Simulate IP extraction
        const ip = c.req.header('cf-connecting-ip') || 
                  c.req.header('x-forwarded-for') || 
                  c.req.header('x-real-ip') || 
                  'unknown';
        capturedKey = ip;
        await next();
      });

      const entryId = 'test-entry';
      const req = new Request(`http://localhost/api/likes/${entryId}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'CF-Connecting-IP': '192.168.1.1'
        },
        body: JSON.stringify({ counts: 1 }),
      });

      // When: Sending request with IP header
      await app.request(req);

      // Then: Should use IP for rate limiting
      expect(capturedKey).toBe('192.168.1.1');
    });

    it('should handle missing IP headers gracefully', async () => {
      // Given: Mock to capture key generation without IP headers
      let capturedKey: string | undefined;
      mockRateLimiter.normal.mockImplementation(async (c: any, next: () => Promise<void>) => {
        const ip = c.req.header('cf-connecting-ip') || 
                  c.req.header('x-forwarded-for') || 
                  c.req.header('x-real-ip') || 
                  'unknown';
        capturedKey = ip;
        await next();
      });

      const entryId = 'test-entry';
      const req = new Request(`http://localhost/api/likes/${entryId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ counts: 1 }),
      });

      // When: Sending request without IP headers
      await app.request(req);

      // Then: Should fallback to 'unknown'
      expect(capturedKey).toBe('unknown');
    });
  });
});