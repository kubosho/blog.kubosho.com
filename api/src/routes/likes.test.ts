import { describe, it, expect } from 'vitest';
import app from '../index';

// Response type definitions
interface LikeResponse {
  success: boolean;
  total?: number;
}

interface CountResponse {
  counts: number;
}

interface ErrorResponse {
  success: false;
  error: string;
  details?: unknown;
}

describe('Likes API', () => {
  describe('POST /api/likes/:entryId', () => {
    it('should return success response when valid data is provided', async () => {
      // Given: a valid entry ID and counts value within acceptable range
      const entryId = 'test-entry';
      const counts = 5;
      const req = new Request(`http://localhost/api/likes/${entryId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ counts }),
      });

      // When: sending a POST request to the likes API
      const res = await app.request(req);
      const data = await res.json() as LikeResponse;

      // Then: should return success response with total value
      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.total).toBeGreaterThanOrEqual(counts);
      expect(typeof data.total).toBe('number');
    });

    it('should reject request when counts value is too low', async () => {
      // Given: counts value below minimum (0)
      const entryId = 'test-entry';
      const invalidCounts = 0;
      const req = new Request(`http://localhost/api/likes/${entryId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ counts: invalidCounts }),
      });

      // When: sending a POST request to the likes API
      const res = await app.request(req);
      const data = await res.json() as ErrorResponse;

      // Then: should return validation error
      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Validation failed');
    });

    it('should reject request when counts value is too high', async () => {
      // Given: counts value exceeding maximum (101)
      const entryId = 'test-entry';
      const invalidCounts = 101;
      const req = new Request(`http://localhost/api/likes/${entryId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ counts: invalidCounts }),
      });

      // When: sending a POST request to the likes API
      const res = await app.request(req);
      const data = await res.json() as ErrorResponse;

      // Then: should return validation error
      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Validation failed');
    });

    it('should reject request when entryId format is invalid', async () => {
      // Given: entry ID containing invalid characters
      const invalidEntryId = 'invalid@entry!';
      const counts = 5;
      const req = new Request(`http://localhost/api/likes/${invalidEntryId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ counts }),
      });

      // When: sending a POST request to the likes API
      const res = await app.request(req);
      const data = await res.json() as ErrorResponse;

      // Then: should return entry ID format error
      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid entry ID');
    });

    it('should reject request when JSON format is invalid', async () => {
      // Given: invalid JSON format in request body
      const entryId = 'test-entry';
      const invalidJson = 'invalid json';
      const req = new Request(`http://localhost/api/likes/${entryId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: invalidJson,
      });

      // When: sending a POST request to the likes API
      const res = await app.request(req);
      const data = await res.json() as ErrorResponse;

      // Then: should return JSON format error
      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid request format');
    });
  });

  describe('GET /api/likes/:entryId', () => {
    it('should return like count when valid entryId is provided', async () => {
      // Given: a valid entry ID
      const entryId = 'test-entry';
      const req = new Request(`http://localhost/api/likes/${entryId}`, {
        method: 'GET',
      });

      // When: sending a GET request to retrieve like count
      const res = await app.request(req);
      const data = await res.json() as CountResponse;

      // Then: should return like count
      expect(res.status).toBe(200);
      expect(typeof data.counts).toBe('number');
      expect(data.counts).toBeGreaterThanOrEqual(0);
    });

    it('should reject request when entryId format is invalid', async () => {
      // Given: entry ID containing invalid characters
      const invalidEntryId = 'invalid@entry!';
      const req = new Request(`http://localhost/api/likes/${invalidEntryId}`, {
        method: 'GET',
      });

      // When: sending a GET request to retrieve like count
      const res = await app.request(req);
      const data = await res.json() as ErrorResponse;

      // Then: should return entry ID format error
      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid entry ID');
    });
  });

  describe('Error handling', () => {
    it('should return 404 when non-existent route is accessed', async () => {
      // Given: a non-existent API endpoint
      const nonExistentEndpoint = '/api/nonexistent';
      const req = new Request(`http://localhost${nonExistentEndpoint}`, {
        method: 'GET',
      });

      // When: sending a request to non-existent endpoint
      const res = await app.request(req);
      const data = await res.json() as ErrorResponse;

      // Then: should return 404 error
      expect(res.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Not Found');
    });
  });
});