import { retrieveTranslation } from '../locales/i18n';

interface Params {
  title: string;
  content: string;
  publishedDateString: string;
  revisedDateString: string;
}

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

export function createBlogPostingStructuredData(params: Params): BlogPostingStructuredData {
  const { content, publishedDateString, revisedDateString, title } = params;

  const data = {
    '@context': 'http://schema.org' as const,
    '@type': 'BlogPosting' as const,
    articleBody: content,
    author: {
      '@type': 'Person' as const,
      name: retrieveTranslation('website.author'),
    },
    dateModified: revisedDateString,
    datePublished: publishedDateString,
    headline: title,
  };

  return data;
}
