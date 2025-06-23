import { describe, expect, it } from 'vitest';

import app from './index';
import type { ErrorResponse } from './middleware/errorResponseType';

describe('API Foundation', () => {
  describe('Root endpoint', () => {
    it('should return "Hello Hono!"', async () => {
      // Given
      const req = new Request('http://localhost/', {
        method: 'GET',
      });

      // When
      const res = await app.request(req);
      const data = await res.json();

      // Then
      expect(res.status).toBe(200);
      expect(data).toBe('Hello Hono!');
    });
  });

  describe('Error handling', () => {
    it('should return 404 for not found routes', async () => {
      // Given
      const req = new Request('http://localhost/api/not-found', {
        method: 'GET',
      });
      const expectedResponseData: ErrorResponse = {
        success: false,
        error: 'Not Found',
      };

      // When
      const res = await app.request(req);
      const data = await res.json<ErrorResponse>();

      // Then
      expect(res.status).toBe(404);
      expect(data).toEqual(expectedResponseData);
    });
  });
});
