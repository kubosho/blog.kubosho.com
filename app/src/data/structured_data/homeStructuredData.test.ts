vi.mock('../../../locales/i18n', () => ({
  retrieveTranslation: vi.fn(() => 'Test Site Name'),
}));

vi.stubEnv('SITE', 'https://example.com');

import { describe, expect, it, vi } from 'vitest';

import { createHomeStructuredData } from './homeStructuredData';

describe('createHomeStructuredData', () => {
  it('should return a valid WebSite JSON-LD structure', () => {
    // Act
    const result = createHomeStructuredData();

    // Assert
    expect(result).toEqual({
      '@context': 'http://schema.org',
      '@type': 'WebSite',
      name: 'Test Site Name',
      url: 'https://example.com',
    });
  });
});
