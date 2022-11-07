import Head from 'next/head';

import { EntryList } from '../../components/EntryList';
import { SITE_URL } from '../../constants/site_data';
import { getEntryList } from '../../entry/entry_gateway';
import { EntryValue } from '../../entry/entry_value';
import { retrieveTranslation } from '../../locales/i18n';

type Props = {
  entries: EntryValue[];
};

const Entries = (props: Props): JSX.Element => {
  const { entries } = props;
  const title = retrieveTranslation('website.title');
  const description = retrieveTranslation('website.description');

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:type" content="website" />
      </Head>
      <EntryList title={retrieveTranslation('top.entryListTitle')} entries={entries} />
    </>
  );
};

export async function getStaticProps(): Promise<{ props: Props }> {
  const entries = await getEntryList();

  return {
    props: {
      entries,
    },
  };
}

export default Entries;
