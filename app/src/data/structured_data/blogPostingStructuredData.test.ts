vi.mock('../../../locales/i18n', () => ({
  retrieveTranslation: vi.fn(() => 'Test Author'),
}));

import { describe, expect, it, vi } from 'vitest';

import { createBlogPostingStructuredData } from './blogPostingStructuredData';

describe('createBlogPostingStructuredData', () => {
  it('should return a valid BlogPosting JSON-LD structure', () => {
    // Arrange
    const params = {
      title: 'Test Title',
      content: 'Test article body content',
      publishedDateString: '2024-01-15',
      revisedDateString: '2024-02-20',
    };

    // Act
    const result = createBlogPostingStructuredData(params);

    // Assert
    expect(result).toEqual({
      '@context': 'http://schema.org',
      '@type': 'BlogPosting',
      articleBody: 'Test article body content',
      author: {
        '@type': 'Person',
        name: 'Test Author',
      },
      dateModified: '2024-02-20',
      datePublished: '2024-01-15',
      headline: 'Test Title',
    });
  });
});
