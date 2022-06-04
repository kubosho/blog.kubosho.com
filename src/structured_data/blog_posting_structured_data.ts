import { AUTHOR } from '../constants/site_data';
import { formatISOString } from '../entry/date';
import { EntryValue } from '../entry/entry_value';

type ISO8601String = string;

// https://developers.google.com/search/docs/data-types/article#non-amp
export interface BlogPostingStructuredData {
  '@context': 'http://schema.org';
  '@type': 'BlogPosting';
  articleBody: string;
  author: {
    '@type': 'Person';
    name: string;
  };
  dateModified: ISO8601String;
  datePublished: ISO8601String;
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
      name: AUTHOR,
    },
    dateModified: formatISOString(revisedAt),
    datePublished: formatISOString(publishedAt),
    headline: title,
  };

  return data;
}
