import { describe, expect, it } from 'vitest';

import app from './index';

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
});
