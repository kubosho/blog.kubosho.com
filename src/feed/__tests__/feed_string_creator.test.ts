import { expect, test } from 'vitest';
import renderer from 'react-test-renderer';

import { SITE_URL } from '../../../constants/site_data';
import { EntryValue } from '../../entry/entry_value';
import { mockBlogApiSchema } from '../__mocks__/mock_entry_value_parameter';
import { createXmlString } from '../feed_string_creator';
import { createFeedValue } from '../feed_value';

test('Feed correctly', () => {
  const metadata = {
    title: 'test',
    baseUrl: SITE_URL,
    buildTime: '2023-02-08T08:10:03.979Z',
  };
  const entryValue = new EntryValue(mockBlogApiSchema);
  const feedValue = createFeedValue([entryValue], metadata);
  const tree = renderer.create(createXmlString(feedValue)).toJSON();
  expect(tree).toMatchSnapshot();
});
