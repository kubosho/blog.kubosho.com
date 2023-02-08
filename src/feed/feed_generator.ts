import { EntryValue } from '../entry/entry_value';

import { createXmlString } from './feed_string_creator';
import { createFeedValue, WebSiteMetadata } from './feed_value';

export function generateFeed(entryValues: EntryValue[], metadata: WebSiteMetadata): string {
  const feedValue = createFeedValue(entryValues, metadata);
  return createXmlString(feedValue);
}
