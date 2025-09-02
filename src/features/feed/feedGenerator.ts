import escapeHTML from 'escape-html';

import { pathList } from '../../../constants/path_list';
import { AUTHOR, BASE_LANGUAGE, SITE_HOSTNAME, SITE_URL } from '../../../constants/site_data';
import { formatIsoString, formatYYMMDDString } from '../entry/date';
import { convertMarkdownToHtml } from '../entry/entryConverter';
import type { TinyCollectionEntry } from '../entry/tinyCollectionEntry';

interface WebSiteMetadata {
  title: string;
  description: string;
  baseUrl: string;
  buildTime: string;
}

async function createXmlString(entries: TinyCollectionEntry[], metadata: WebSiteMetadata): Promise<string> {
  const metaXmlString = createMetaXmlString(metadata);
  const itemsXmlString = await createItemsXmlString(entries);

  return `<?xml version="1.0" encoding="utf-8" ?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${BASE_LANGUAGE}">
${metaXmlString}
${itemsXmlString}
</feed>
`;
}

function createMetaXmlString(metadata: WebSiteMetadata): string {
  const { title, description, baseUrl, buildTime } = metadata;
  const { host } = new URL(baseUrl);

  return `<title>${title}</title>
<subtitle>${description}</subtitle>
<id>tag:${host},2014:feed</id>
<author>
  <name>${AUTHOR}</name>
</author>
<updated>${buildTime}</updated>
<link rel="alternate" href="${baseUrl}"/>
<link rel="self" type="application/atom+xml" href="${baseUrl}${pathList.feed}"/>`;
}

async function createItemsXmlString(entries: TinyCollectionEntry[]): Promise<string> {
  const xmlStrings = await Promise.all(
    entries.map(async (entry) => {
      const { data, slug } = entry;
      const content = await convertMarkdownToHtml(entry.body);

      return `<entry>
<title>${data.title}</title>
<link rel="alternate" href="${SITE_URL}${pathList.entries}/${slug}"/>
<id>tag:${SITE_HOSTNAME},${formatYYMMDDString(data.publishedAt, { year: '-', month: '-', day: '' })}:entry:${slug}</id>
<summary>${data.excerpt}</summary>
<content type="html">${escapeHTML(content).trim()}</content>
<published>${formatIsoString(data.publishedAt)}</published>
<updated>${formatIsoString(data.revisedAt ?? data.publishedAt)}</updated>
</entry>`;
    }),
  );

  return xmlStrings.join('\n');
}

export async function generateFeed(entries: TinyCollectionEntry[], metadata: WebSiteMetadata): Promise<string> {
  return await createXmlString(entries, metadata);
}
