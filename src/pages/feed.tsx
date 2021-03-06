import { NextPageContext } from 'next';
import { SITE_TITLE, SITE_URL } from '../constants/site_data';
import { XmlString, createXmlString } from '../feed/feedStringCreator';
import { createFeedValue } from '../feed/feedValue';
import { getEntryList } from '../entry/entryGateway';

interface Props {
  feedString: XmlString;
}

const Feed = (): null => null;
export default Feed;

export async function getServerSideProps({ res }: NextPageContext): Promise<{ props: Props }> {
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
    title: SITE_TITLE,
    baseUrl: SITE_URL,
  });
  return createXmlString(feedValue, SITE_URL);
}
