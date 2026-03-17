import { describe, expect, it } from 'vitest';

import { GET, POST } from './optout';

function createCookiesStub(initialCookies: Record<string, string> = {}): {
  has: (key: string) => boolean;
  set: (key: string, value: string) => Map<string, string>;
  delete: (key: string) => boolean;
} {
  const store = new Map(Object.entries(initialCookies));
  return {
    has: (key: string) => store.has(key),
    set: (key: string, value: string) => store.set(key, value),
    delete: (key: string) => store.delete(key),
  };
}

describe('GET /api/optout', () => {
  it('returns { enabled: false } without cookie', async () => {
    // Act
    const response = GET({ cookies: createCookiesStub() } as never);

    // Assert
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ enabled: false });
  });

  it('returns { enabled: true } with cookie', async () => {
    // Act
    const response = GET({ cookies: createCookiesStub({ analytics_optout_enabled: 'true' }) } as never);

    // Assert
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ enabled: true });
  });
});

describe('POST /api/optout', () => {
  it('sets cookie and returns 200 without cookie', async () => {
    // Arrange
    const cookies = createCookiesStub();

    // Act
    const response = POST({ cookies } as never);

    // Assert
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ message: 'Cookie is created.' });
  });

  it('deletes cookie and returns 204 with cookie', () => {
    // Arrange
    const cookies = createCookiesStub({ analytics_optout_enabled: 'true' });

    // Act
    const response = POST({ cookies } as never);

    // Assert
    expect(response.status).toBe(204);
    expect(response.body).toBeNull();
  });
});
