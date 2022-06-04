import { EntryValue } from '../entry/entryValue';

export interface FeedValue {
  channel: {
    title: string;
    link: string;
  };
  items: {
    title: string;
    content: string;
    summary: string;
    link: string;
    published: number;
    updated: number;
  }[];
}

export interface WebSiteMetadata {
  title: string;
  baseUrl: string;
}

export function createFeedValue(entries: readonly EntryValue[], metadata: WebSiteMetadata): FeedValue {
  const channel = {
    title: metadata.title,
    link: metadata.baseUrl,
  };

  const items = entries.map((entry) => {
    const link = `${metadata.baseUrl}/entry/${entry.slug}`;
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
    channel,
    items,
  };
}
