import entries from '../../data/entries.json';
import { SITE_TITLE, SITE_URL, SITE_DESCRIPTION } from '../../constants';
import { EntryValue } from '../../entry/entryValue';
import { formatRFC2822 } from '../../entry/date';

type RssObject = {
  channel: {
    title: string;
    link: string;
    description: string;
  };
  items: Array<{
    title: string;
    link: string;
    description: string;
    pubDate: string;
  }>;
};
type XmlString = string;

export default (_, res): void => {
  const rss = createRss();

  res.setHeader('Content-Type', 'application/xml');
  res.statusCode = 200;
  res.end(rss);
};

function createRss(): XmlString {
  const o = createRssObject(entries);
  const r = createXmlString(o);
  return r;
}

function createRssObject(entries: ReadonlyArray<EntryValue>): RssObject {
  const channel = {
    title: SITE_TITLE,
    link: SITE_URL,
    description: SITE_DESCRIPTION,
  };

  const items = entries.map(entry => {
    const link = `${SITE_URL}/entry/${entry.slug}`;
    const pubDate = formatRFC2822(entry.createdAt);

    return {
      title: entry.title,
      description: entry.excerpt,
      pubDate,
      link,
    };
  });

  const r = {
    channel,
    items,
  };

  return r;
}

function createXmlString(rssObj: RssObject): XmlString {
  const r = `<?xml version="1.0" encoding="utf-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  ${createMetaXmlString(rssObj)}
  ${createItemsXmlString(rssObj)}
</channel>
</rss>`;

  return r;
}

function createMetaXmlString(rssObj: RssObject): XmlString {
  const { title, description, link } = rssObj.channel;

  const r = `<title>${title}</title>
<link>${link}</link>
<description>${description}</description>
<atom:link href="${SITE_URL}/feed" rel="self" type="application/rss+xml"/>`;

  return r;
}

function createItemsXmlString(rssObj: RssObject): XmlString {
  const { items } = rssObj;

  const xmlStrings = items.map(
    item =>
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
