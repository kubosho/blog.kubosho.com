import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

import { SITE_URL } from '../constants/site_data';
import { EntryList } from '../components/EntryList';
import { EntryValue } from '../entry/entry_value';
import { getEntryList } from '../entry/entry_gateway';
import { retrieveTranslation } from '../locales/i18n';

import styles from './index.module.css';

interface Props {
  entries: EntryValue[];
}

const TopPage = (props: Props): JSX.Element => {
  const { entries } = props;
  const title = retrieveTranslation('website.title');
  const description = retrieveTranslation('website.description');

  const e = (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:type" content="website" />
      </Head>
      <EntryList entries={entries} />
      <Link href="/entries" as={`/entries`} passHref>
        <a className={styles['entries-link']}>記事一覧</a>
      </Link>
    </>
  );

  return e;
};

export async function getStaticProps(): Promise<{ props: Props }> {
  const entries = await getEntryList();

  return {
    props: {
      entries: entries.slice(0, 10),
    },
  };
}

export default TopPage;
