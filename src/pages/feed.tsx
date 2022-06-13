import { NextPageContext } from 'next';
import { SITE_URL } from '../constants/site_data';
import { XmlString, createXmlString } from '../feed/feed_string_creator';
import { createFeedValue } from '../feed/feed_value';
import { getEntryList } from '../entry/entry_gateway';
import { activateI18n, retrieveTranslation, setLocale } from '../locales/i18n';

interface Props {
  feedString: XmlString;
}

const Feed = (): null => null;
export default Feed;

export async function getServerSideProps({ res }: NextPageContext): Promise<{ props: Props }> {
  activateI18n();
  setLocale('ja');

  const feedString = await createFeedString();
  const props = {
    feedString,
  };

  res.setHeader('Content-Type', 'application/xml');
  res.statusCode = 200;
  res.end(feedString);

  return {
    props,
  };
}

async function createFeedString(): Promise<XmlString> {
  const entryValueList = await getEntryList();
  const feedValue = createFeedValue(entryValueList, {
    title: retrieveTranslation('website.title'),
    baseUrl: SITE_URL,
  });
  return createXmlString(feedValue, SITE_URL);
}
