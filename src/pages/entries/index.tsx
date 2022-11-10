import Head from 'next/head';

import { EntryList } from '../../components/EntryList';
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
        <meta name="description" content={description} />
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
