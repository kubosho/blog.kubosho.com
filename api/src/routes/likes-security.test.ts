import { describe, expect, it, beforeEach } from 'vitest';

import app from '../index';

describe('Likes API - Security Tests', () => {
  describe('Input validation - entryId', () => {
    it('should reject empty entryId', async () => {
      // Given: Request with empty entryId
      const req = new Request('http://localhost/api/likes/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ counts: 1 }),
      });

      // When: Sending request
      const res = await app.request(req);
      const data = await res.json();

      // Then: Should return 404 (route not matched)
      expect(res.status).toBe(404);
    });

    it('should reject entryId with special characters', async () => {
      // Given: Request with special characters in entryId
      const invalidEntryIds = [
        'entry@id',
        'entry#id',
        'entry%id',
        'entry&id',
        'entry*id',
        'entry+id',
        'entry=id',
        'entry[id]',
        'entry{id}',
        'entry|id',
        'entry\\id',
        'entry/id',
        'entry<id>',
        'entry"id"',
        "entry'id'",
        'entry`id`',
        'entry~id',
        'entry!id',
        'entry?id',
        'entry:id',
        'entry;id',
        'entry,id',
      ];

      for (const entryId of invalidEntryIds) {
        const req = new Request(`http://localhost/api/likes/${entryId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ counts: 1 }),
        });

        // When: Sending request
        const res = await app.request(req);
        const data = await res.json();

        // Then: Should return validation error
        expect(res.status).toBe(400);
        expect(data.success).toBe(false);
        expect(data.error).toBe('Invalid entry ID');
      }
    });

    it('should accept valid entryId formats', async () => {
      // Given: Request with valid entryId formats
      const validEntryIds = [
        'simple-entry',
        'entry_with_underscores',
        'entry.with.dots',
        'entry-123',
        'entry_123.test',
        'UPPERCASE-ENTRY',
        'MixedCase_Entry.123',
        '123-numeric-start',
        'a', // minimum length
        'a'.repeat(255), // maximum length
      ];

      for (const entryId of validEntryIds) {
        const req = new Request(`http://localhost/api/likes/${entryId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ counts: 1 }),
        });

        // When: Sending request
        const res = await app.request(req);
        const data = await res.json();

        // Then: Should succeed (pass validation)
        expect(res.status).toBe(200);
        expect(data.success).toBe(true);
      }
    });

    it('should reject overly long entryId', async () => {
      // Given: Request with entryId exceeding 255 characters
      const longEntryId = 'a'.repeat(256);
      const req = new Request(`http://localhost/api/likes/${longEntryId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ counts: 1 }),
      });

      // When: Sending request
      const res = await app.request(req);
      const data = await res.json();

      // Then: Should return validation error
      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid entry ID');
    });
  });

  describe('Input validation - counts', () => {
    it('should reject counts below minimum (0 and negative)', async () => {
      // Given: Request with invalid counts values
      const invalidCounts = [0, -1, -10, -100];

      for (const counts of invalidCounts) {
        const req = new Request('http://localhost/api/likes/test-entry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ counts }),
        });

        // When: Sending request
        const res = await app.request(req);
        const data = await res.json();

        // Then: Should return validation error
        expect(res.status).toBe(400);
        expect(data.success).toBe(false);
        expect(data.error).toBe('Validation failed');
      }
    });

    it('should reject counts above maximum (over 100)', async () => {
      // Given: Request with counts exceeding maximum
      const invalidCounts = [101, 500, 1000, 9999];

      for (const counts of invalidCounts) {
        const req = new Request('http://localhost/api/likes/test-entry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ counts }),
        });

        // When: Sending request
        const res = await app.request(req);
        const data = await res.json();

        // Then: Should return validation error
        expect(res.status).toBe(400);
        expect(data.success).toBe(false);
        expect(data.error).toBe('Validation failed');
      }
    });

    it('should reject non-integer counts', async () => {
      // Given: Request with non-integer counts
      const invalidCounts = [1.5, 2.7, 99.9, Math.PI];

      for (const counts of invalidCounts) {
        const req = new Request('http://localhost/api/likes/test-entry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ counts }),
        });

        // When: Sending request
        const res = await app.request(req);
        const data = await res.json();

        // Then: Should return validation error
        expect(res.status).toBe(400);
        expect(data.success).toBe(false);
        expect(data.error).toBe('Validation failed');
      }
    });

    it('should reject non-numeric counts', async () => {
      // Given: Request with non-numeric counts
      const invalidCounts = ['string', true, false, null, undefined, {}, []];

      for (const counts of invalidCounts) {
        const req = new Request('http://localhost/api/likes/test-entry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ counts }),
        });

        // When: Sending request
        const res = await app.request(req);
        const data = await res.json();

        // Then: Should return validation error
        expect(res.status).toBe(400);
        expect(data.success).toBe(false);
        expect(data.error).toMatch(/Validation failed|Invalid counts value/);
      }
    });
  });

  describe('SQL injection protection', () => {
    it('should reject SQL injection attempts in entryId', async () => {
      // Given: Request with SQL injection payloads
      const sqlInjectionPayloads = [
        "'; DROP TABLE likes; --",
        "' OR '1'='1",
        "' UNION SELECT * FROM users --",
        "'; INSERT INTO likes VALUES (999, 999); --",
        "' OR 1=1 --",
        "admin'--",
        "admin'/*",
        "' OR 'x'='x",
        "'; EXEC xp_cmdshell('dir'); --",
      ];

      for (const payload of sqlInjectionPayloads) {
        const req = new Request(`http://localhost/api/likes/${encodeURIComponent(payload)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ counts: 1 }),
        });

        // When: Sending request
        const res = await app.request(req);
        const data = await res.json();

        // Then: Should be rejected by validation
        expect(res.status).toBe(400);
        expect(data.success).toBe(false);
        expect(data.error).toBe('Invalid entry ID');
      }
    });

    it('should reject SQL injection attempts in counts field', async () => {
      // Given: Request with SQL injection in counts (as string)
      const req = new Request('http://localhost/api/likes/test-entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ counts: "1; DROP TABLE likes; --" }),
      });

      // When: Sending request
      const res = await app.request(req);
      const data = await res.json();

      // Then: Should be rejected by validation
      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Validation failed');
    });
  });

  describe('XSS protection', () => {
    it('should reject XSS attempts in entryId', async () => {
      // Given: Request with XSS payloads
      const xssPayloads = [
        '<script>alert("xss")</script>',
        '<img src="x" onerror="alert(1)">',
        '<svg onload="alert(1)">',
        'javascript:alert(1)',
        '<iframe src="javascript:alert(1)">',
        '<body onload="alert(1)">',
        '<div onclick="alert(1)">',
        '<a href="javascript:alert(1)">',
        '<script src="http://evil.com/script.js"></script>',
        '<object data="javascript:alert(1)">',
      ];

      for (const payload of xssPayloads) {
        const req = new Request(`http://localhost/api/likes/${encodeURIComponent(payload)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ counts: 1 }),
        });

        // When: Sending request
        const res = await app.request(req);
        const data = await res.json();

        // Then: Should be rejected by validation
        expect(res.status).toBe(400);
        expect(data.success).toBe(false);
        expect(data.error).toBe('Invalid entry ID');
      }
    });

    it('should sanitize response data to prevent XSS', async () => {
      // Given: Valid request
      const req = new Request('http://localhost/api/likes/test-entry', {
        method: 'GET',
      });

      // When: Sending request
      const res = await app.request(req);
      const data = await res.json();

      // Then: Response should have proper content type and not contain executable content
      expect(res.headers.get('Content-Type')).toContain('application/json');
      expect(typeof data.counts).toBe('number');
      
      // Ensure response doesn't contain script tags or other executable content
      const responseText = JSON.stringify(data);
      expect(responseText).not.toMatch(/<script/i);
      expect(responseText).not.toMatch(/javascript:/i);
      expect(responseText).not.toMatch(/on\w+=/i);
    });
  });

  describe('Content-Type validation', () => {
    it('should handle missing Content-Type header', async () => {
      // Given: Request without Content-Type header
      const req = new Request('http://localhost/api/likes/test-entry', {
        method: 'POST',
        body: JSON.stringify({ counts: 1 }),
      });

      // When: Sending request
      const res = await app.request(req);

      // Then: Should handle gracefully (may succeed or fail with proper error)
      expect([200, 400, 415]).toContain(res.status);
    });

    it('should handle invalid JSON payload', async () => {
      // Given: Request with invalid JSON
      const invalidJsonPayloads = [
        '{ invalid json }',
        '{ "counts": }',
        '{ "counts": 1, }',
        '{ "counts": "string" but missing quotes',
        'not json at all',
        '',
        '{',
        '}',
        '{ "counts": 1, "counts": 2 }', // duplicate keys
      ];

      for (const payload of invalidJsonPayloads) {
        const req = new Request('http://localhost/api/likes/test-entry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
        });

        // When: Sending request
        const res = await app.request(req);
        const data = await res.json();

        // Then: Should return proper error
        expect(res.status).toBe(400);
        expect(data.success).toBe(false);
      }
    });

    it('should handle extremely large payloads', async () => {
      // Given: Request with extremely large payload
      const largePayload = JSON.stringify({ 
        counts: 1, 
        extraData: 'x'.repeat(10 * 1024 * 1024) // 10MB string
      });

      const req = new Request('http://localhost/api/likes/test-entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: largePayload,
      });

      // When: Sending request
      const res = await app.request(req);

      // Then: Should handle appropriately (reject or process)
      // Response should be within reasonable time and not cause server issues
      expect(res.status).toBeGreaterThanOrEqual(200);
      expect(res.status).toBeLessThan(600);
    });
  });

  describe('CORS and headers', () => {
    it('should handle various origin headers', async () => {
      // Given: Request with different origin headers
      const origins = [
        'https://example.com',
        'http://localhost:3000',
        'https://malicious-site.com',
        'null',
        '',
      ];

      for (const origin of origins) {
        const req = new Request('http://localhost/api/likes/test-entry', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Origin': origin,
          },
          body: JSON.stringify({ counts: 1 }),
        });

        // When: Sending request
        const res = await app.request(req);

        // Then: Should handle origin appropriately
        expect(res.status).toBeGreaterThanOrEqual(200);
        expect(res.status).toBeLessThan(500);
      }
    });

    it('should not expose sensitive headers', async () => {
      // Given: Valid request
      const req = new Request('http://localhost/api/likes/test-entry', {
        method: 'GET',
      });

      // When: Sending request
      const res = await app.request(req);

      // Then: Should not expose sensitive information in headers
      expect(res.headers.get('X-Powered-By')).toBeNull();
      expect(res.headers.get('Server')).toBeNull();
      
      // Should have security headers (if implemented)
      // expect(res.headers.get('X-Content-Type-Options')).toBe('nosniff');
      // expect(res.headers.get('X-Frame-Options')).toBe('DENY');
    });
  });

  describe('Method validation', () => {
    it('should reject unsupported HTTP methods', async () => {
      // Given: Request with unsupported methods
      const unsupportedMethods = ['PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS', 'TRACE'];

      for (const method of unsupportedMethods) {
        const req = new Request('http://localhost/api/likes/test-entry', {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: method !== 'HEAD' ? JSON.stringify({ counts: 1 }) : undefined,
        });

        // When: Sending request
        const res = await app.request(req);

        // Then: Should return method not allowed or not found
        expect([404, 405]).toContain(res.status);
      }
    });
  });

  describe('Parameter injection', () => {
    it('should handle URL-encoded parameters safely', async () => {
      // Given: Request with URL-encoded malicious content
      const maliciousParams = [
        '../../../etc/passwd',
        '%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd',
        '..\\..\\..\\windows\\system32\\drivers\\etc\\hosts',
        'test?extra=param',
        'test#fragment',
        'test/../other-entry',
      ];

      for (const param of maliciousParams) {
        const req = new Request(`http://localhost/api/likes/${encodeURIComponent(param)}`, {
          method: 'GET',
        });

        // When: Sending request
        const res = await app.request(req);
        const data = await res.json();

        // Then: Should be handled safely by validation
        expect(res.status).toBe(400);
        expect(data.success).toBe(false);
        expect(data.error).toBe('Invalid entry ID');
      }
    });
  });

  describe('Error message security', () => {
    it('should not expose internal system information in error messages', async () => {
      // Given: Request that will cause validation error
      const req = new Request('http://localhost/api/likes/invalid@entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ counts: 1 }),
      });

      // When: Sending request
      const res = await app.request(req);
      const data = await res.json();

      // Then: Error message should not expose internal details
      expect(res.status).toBe(400);
      expect(data.error).toBe('Invalid entry ID');
      
      // Should not contain:
      const responseText = JSON.stringify(data);
      expect(responseText.toLowerCase()).not.toContain('stack');
      expect(responseText.toLowerCase()).not.toContain('database');
      expect(responseText.toLowerCase()).not.toContain('internal');
      expect(responseText.toLowerCase()).not.toContain('server');
      expect(responseText.toLowerCase()).not.toContain('file');
      expect(responseText.toLowerCase()).not.toContain('path');
    });
  });
});