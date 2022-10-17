import { expect, test } from 'vitest';
import renderer from 'react-test-renderer';
import { SITE_URL } from '../../constants/site_data';
import { EntryValue } from '../../entry/entry_value';
import { mockBlogApiSchema } from '../__mocks__/mock_entry_value_parameter';
import { createXmlString } from '../feed_string_creator';
import { createFeedValue, WebSiteMetadata } from '../feed_value';

test('Feed correctly', () => {
  const metadata: WebSiteMetadata = {
    title: 'test',
    baseUrl: SITE_URL,
  };
  const entryValue = new EntryValue(mockBlogApiSchema);
  const feedValue = createFeedValue([entryValue], metadata);
  const tree = renderer.create(createXmlString(feedValue, SITE_URL)).toJSON();
  expect(tree).toMatchSnapshot();
});
