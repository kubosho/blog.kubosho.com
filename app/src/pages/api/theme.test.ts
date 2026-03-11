import type { APIContext } from 'astro';
import { describe, expect, it, vi } from 'vitest';

import { GET, POST } from './theme';

type CookiesStub = {
  has: ReturnType<typeof vi.fn>;
  get: ReturnType<typeof vi.fn>;
  set: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

function createCookiesStub(store: Map<string, string> = new Map()): CookiesStub {
  return {
    has: vi.fn((key: string) => store.has(key)),
    get: vi.fn((key: string) => {
      const value = store.get(key);
      return value != null ? { value } : undefined;
    }),
    set: vi.fn(),
    delete: vi.fn(),
  };
}

function postRequest(body: string): Request {
  return new Request('http://localhost/api/theme', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
}

describe('GET /api/theme', () => {
  it('returns { theme: "system" } when no cookie is set', async () => {
    // Arrange
    const cookies = createCookiesStub();

    // Act
    const response = GET({ cookies } as unknown as APIContext);

    // Assert
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ theme: 'system' });
  });

  it('returns the cookie value as theme', async () => {
    // Arrange
    const cookies = createCookiesStub(new Map([['theme', 'dark']]));

    // Act
    const response = GET({ cookies } as unknown as APIContext);

    // Assert
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ theme: 'dark' });
  });
});

describe('POST /api/theme', () => {
  it('sets cookie and returns the theme for dark', async () => {
    // Arrange
    const cookies = createCookiesStub();
    const request = postRequest(JSON.stringify({ theme: 'dark' }));

    // Act
    const response = await POST({ cookies, request } as unknown as APIContext);

    // Assert
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ theme: 'dark' });
    expect(cookies.set).toHaveBeenCalledOnce();
  });

  it('deletes cookie and returns system for system theme', async () => {
    // Arrange
    const cookies = createCookiesStub(new Map([['theme', 'dark']]));
    const request = postRequest(JSON.stringify({ theme: 'system' }));

    // Act
    const response = await POST({ cookies, request } as unknown as APIContext);

    // Assert
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ theme: 'system' });
    expect(cookies.delete).toHaveBeenCalledOnce();
  });

  it('returns 400 for invalid theme value', async () => {
    // Arrange
    const cookies = createCookiesStub();
    const request = postRequest(JSON.stringify({ theme: 'invalid' }));

    // Act
    const response = await POST({ cookies, request } as unknown as APIContext);

    // Assert
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Invalid theme value' });
  });

  it('returns 400 for invalid JSON body', async () => {
    // Arrange
    const cookies = createCookiesStub();
    const request = postRequest('not json');

    // Act
    const response = await POST({ cookies, request } as unknown as APIContext);

    // Assert
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Invalid JSON body' });
  });
});
