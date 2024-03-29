import { formatISOString } from '../entry/date';
import type { EntryValue } from '../entry/entry_value';
import { retrieveTranslation } from '../locales/i18n';

// https://developers.google.com/search/docs/data-types/article#non-amp
export interface BlogPostingStructuredData {
  '@context': 'http://schema.org';
  '@type': 'BlogPosting';
  articleBody: string;
  author: {
    '@type': 'Person';
    name: string;
  };
  dateModified: string;
  datePublished: string;
  headline: string;
}

export function createBlogPostingStructuredData(value: EntryValue): BlogPostingStructuredData {
  const { publishedAt, excerpt, title, revisedAt } = value;
  const data = {
    '@context': 'http://schema.org' as const,
    '@type': 'BlogPosting' as const,
    articleBody: excerpt,
    author: {
      '@type': 'Person' as const,
      name: retrieveTranslation('website.author'),
    },
    dateModified: formatISOString(revisedAt),
    datePublished: formatISOString(publishedAt),
    headline: title,
  };

  return data;
}
