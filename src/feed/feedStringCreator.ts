import { FeedValue } from './feedValue';

export type XmlString = string;

export function createXmlString(feedValue: FeedValue, baseUrl: string): XmlString {
  return `<?xml version="1.0" encoding="utf-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  ${createMetaXmlString(feedValue, baseUrl)}
  ${createItemsXmlString(feedValue)}
</channel>
</rss>`;
}

function createMetaXmlString(feedValue: FeedValue, baseUrl: string): XmlString {
  const { title, description, link } = feedValue.channel;

  return `<title>${title}</title>
<link>${link}</link>
<description>${description}</description>
<atom:link href="${baseUrl}/feed" rel="self" type="application/rss+xml"/>`;
}

function createItemsXmlString(feedValue: FeedValue): XmlString {
  const xmlStrings = feedValue.items.map(
    (item) =>
      `<item>
  <title>${item.title}</title>
  <link>${item.link}</link>
  <guid>${item.link}</guid>
  <description><![CDATA[${item.description}]]></description>
  <pubDate>${item.pubDate}</pubDate>
</item>`,
  );

  return xmlStrings.join('\n');
}
