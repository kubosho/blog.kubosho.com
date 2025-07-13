import { describe, expect, test } from 'vitest';

import api from './index';

describe('API Foundation', () => {
  describe('Root endpoint', () => {
    test('returns "Hello Hono!"', async () => {
      // Given
      const req = new Request('http://localhost/', {
        method: 'GET',
      });

      // When
      const res = await api.request(req);
      const data = await res.text();

      // Then
      expect(res.status).toBe(200);
      expect(data).toBe('Hello Hono!');
    });
  });
});
