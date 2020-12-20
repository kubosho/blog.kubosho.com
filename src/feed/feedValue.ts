import { formatRFC2822 } from '../entry/date';
import { EntryValue } from '../entry/entryValue';

export interface FeedValue {
  channel: {
    title: string;
    description: string;
    link: string;
  };
  items: {
    title: string;
    description: string;
    link: string;
    pubDate: string;
  }[];
}

export interface WebSiteMetadata {
  title: string;
  description: string;
  baseUrl: string;
}

export function createFeedValue(entries: readonly EntryValue[], metadata: WebSiteMetadata): FeedValue {
  const channel = {
    title: metadata.title,
    description: metadata.description,
    link: metadata.baseUrl,
  };

  const items = entries.map((entry) => {
    const link = `${metadata.baseUrl}/entry/${entry.id}`;
    const pubDate = formatRFC2822(entry.createdAt);

    return {
      title: entry.title,
      description: entry.excerpt,
      pubDate,
      link,
    };
  });

  return {
    channel,
    items,
  };
}
