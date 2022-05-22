import { expect, test } from 'vitest';
import renderer from 'react-test-renderer';
import { SITE_TITLE, SITE_URL } from '../../constants/site_data';
import { EntryValue } from '../../entry/entryValue';
import { mockEntryValueParameter } from '../__mocks__/entryValueParameter';
import { createXmlString } from '../feedStringCreator';
import { createFeedValue, WebSiteMetadata } from '../feedValue';

test('Feed correctly', () => {
  const metadata: WebSiteMetadata = {
    title: SITE_TITLE,
    baseUrl: SITE_URL,
  };
  const entryValue = new EntryValue(mockEntryValueParameter);
  const feedValue = createFeedValue([entryValue], metadata);
  const tree = renderer.create(createXmlString(feedValue, SITE_URL)).toJSON();
  expect(tree).toMatchSnapshot();
});
