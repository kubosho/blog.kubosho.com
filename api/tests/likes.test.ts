import { describe, it, expect } from 'vitest';
import app from '../src/index';

describe('Likes API', () => {
  describe('POST /api/likes/:entryId', () => {
    it('should return success response with valid data', async () => {
      const req = new Request('http://localhost/api/likes/test-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ counts: 5 }),
      });

      const res = await app.request(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.total).toBeGreaterThanOrEqual(5);
      expect(typeof data.total).toBe('number');
    });

    it('should reject invalid counts (too low)', async () => {
      const req = new Request('http://localhost/api/likes/test-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ counts: 0 }),
      });

      const res = await app.request(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Validation failed');
    });

    it('should reject invalid counts (too high)', async () => {
      const req = new Request('http://localhost/api/likes/test-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ counts: 101 }),
      });

      const res = await app.request(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Validation failed');
    });

    it('should reject invalid entryId format', async () => {
      const req = new Request('http://localhost/api/likes/invalid@entry!', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ counts: 5 }),
      });

      const res = await app.request(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid entry ID');
    });

    it('should reject invalid JSON format', async () => {
      const req = new Request('http://localhost/api/likes/test-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: 'invalid json',
      });

      const res = await app.request(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid request format');
    });
  });

  describe('GET /api/likes/:entryId', () => {
    it('should return like count for valid entry', async () => {
      const req = new Request('http://localhost/api/likes/test-entry', {
        method: 'GET',
      });

      const res = await app.request(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(typeof data.counts).toBe('number');
      expect(data.counts).toBeGreaterThanOrEqual(0);
    });

    it('should reject invalid entryId format', async () => {
      const req = new Request('http://localhost/api/likes/invalid@entry!', {
        method: 'GET',
      });

      const res = await app.request(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid entry ID');
    });
  });

  describe('Error handling', () => {
    it('should return 404 for non-existent routes', async () => {
      const req = new Request('http://localhost/api/nonexistent', {
        method: 'GET',
      });

      const res = await app.request(req);
      const data = await res.json();

      expect(res.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Not Found');
    });
  });
});