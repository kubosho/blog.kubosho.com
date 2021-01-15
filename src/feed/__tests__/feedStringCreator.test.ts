import renderer from 'react-test-renderer';
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from '../../constants/site_data';
import { EntryValue } from '../../entry/entryValue';
import { mockEntryValueParameter } from '../../entry/__mocks__/entryValueParameter';
import { createXmlString } from '../feedStringCreator';
import { createFeedValue, WebSiteMetadata } from '../feedValue';

it('Feed correctly', () => {
  const metadata: WebSiteMetadata = {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    baseUrl: SITE_URL,
  };
  const entryValue = new EntryValue(mockEntryValueParameter);
  const feedValue = createFeedValue([entryValue], metadata);
  const tree = renderer.create(createXmlString(feedValue, SITE_URL)).toJSON();
  expect(tree).toMatchSnapshot();
});
