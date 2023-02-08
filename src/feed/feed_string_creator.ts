import escapeHtml from 'escape-html';

import { AUTHOR, BASE_LANGUAGE } from '../../constants/site_data';
import { pathList } from '../../constants/path_list';
import { formatISOString, formatYYMMDDString } from '../entry/date';

import { FeedValue } from './feed_value';

export type XmlString = string;

export function createXmlString(feedValue: FeedValue): XmlString {
  return `<?xml version="1.0" encoding="utf-8" ?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${BASE_LANGUAGE}">
${createMetaXmlString(feedValue)}
${createItemsXmlString(feedValue)}
</feed>`;
}

function createMetaXmlString(feedValue: FeedValue): XmlString {
  const { title, baseUrl, buildTime } = feedValue.metadata;
  const { host } = new URL(baseUrl);

  return `<title>${title}</title>
<id>tag:${host},2014:feed</id>
<author>
  <name>${AUTHOR}</name>
</author>
<updated>${buildTime}</updated>
<link rel="alternate" href="${baseUrl}"/>
<link rel="self" type="application/atom+xml" href="${baseUrl}${pathList.feed}"/>`;
}

function createItemsXmlString(feedValue: FeedValue): XmlString {
  const xmlStrings = feedValue.items.map((item) => {
    const { host, pathname } = new URL(item.link);
    const itemId = pathname.slice(pathname.lastIndexOf('/'));

    return `<entry>
<title>${item.title}</title>
<link href="${item.link}" rel="alternate"/>
<id>tag:${host},${formatYYMMDDString(item.published, '-')}:entry:/${itemId}</id>
<content type="html">${escapeHtml(item.content)}</content>
<summary>${item.summary}</summary>
<published>${formatISOString(item.published)}</published>
<updated>${formatISOString(item.updated)}</updated>
</entry>`;
  });

  return xmlStrings.join('\n');
}
