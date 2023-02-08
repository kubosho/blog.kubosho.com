import { pathList } from '../../constants/path_list';
import { EntryValue } from '../entry/entry_value';

export interface WebSiteMetadata {
  title: string;
  baseUrl: string;
  buildTime: string;
}

export interface FeedValue {
  metadata: WebSiteMetadata;
  items: {
    title: string;
    content: string;
    summary: string;
    link: string;
    published: number;
    updated: number;
  }[];
}

export function createFeedValue(entries: readonly EntryValue[], metadata: WebSiteMetadata): FeedValue {
  const items = entries.map((entry) => {
    const link = `${metadata.baseUrl}${pathList.entries}/${entry.slug}`;
    const published = entry.publishedAt;
    const updated = entry.revisedAt;

    return {
      title: entry.title,
      content: entry.body,
      summary: entry.excerpt,
      published,
      updated,
      link,
    };
  });

  return {
    metadata,
    items,
  };
}
