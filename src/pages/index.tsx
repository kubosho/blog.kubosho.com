import React, { useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';

import { EntryList } from '../components/EntryList';
import { EntryValue } from '../entry/entry_value';
import { getEntryList } from '../entry/entry_gateway';
import { retrieveTranslation } from '../locales/i18n';
import { writeFeedFile } from '../feed/feed_file_writer';
import { SITE_URL } from '../constants/site_data';
import { pathList } from '../constants/path_list';

import styles from './index.module.css';

interface Props {
  entries: EntryValue[];
}

const TopPage = (props: Props): JSX.Element => {
  const { entries } = props;
  const title = retrieveTranslation('website.title');
  const description = retrieveTranslation('website.description');

  const pickupEntry = useMemo(() => entries.at(0), [entries]);
  const modifyEntries = useMemo(() => entries.slice(1), [entries]);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={SITE_URL} />
      </Head>
      <EntryList title={retrieveTranslation('top.entryListTitle')} entries={modifyEntries} pickupEntry={pickupEntry} />
      <Link href={pathList.entries} className={styles['entries-link']}>
        {retrieveTranslation('top.entryListLink')}
      </Link>
    </>
  );
};

export async function getStaticProps(): Promise<{ props: Props }> {
  const entries = await getEntryList();

  if (process.env.ON_NEXT_BUILD) {
    await writeFeedFile(entries);
  }

  return {
    props: {
      entries: entries.slice(0, 11),
    },
  };
}

export default TopPage;
