import React from 'react';
import Head from 'next/head';

import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from '../constants/site_data';
import { EntryList } from '../entry/components/EntryList';
import { SiteContents } from '../components/SiteContents';
import { EntryValue } from '../entry/entryValue';
import { fetchEntries } from '../entry/entryGateway';

interface Props {
  entries: Array<EntryValue>;
}

const TopPage = (props: Props): JSX.Element => {
  const { entries } = props;

  const e = (
    <React.Fragment>
      <Head>
        <title>{SITE_TITLE}</title>
        <meta property="og:title" content={SITE_TITLE} />
        <meta name="description" content={SITE_DESCRIPTION} />
        <meta property="og:description" content={SITE_DESCRIPTION} />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:type" content="website" />
      </Head>
      <SiteContents>
        <EntryList entries={entries} />
      </SiteContents>
    </React.Fragment>
  );

  return e;
};

export async function getServerSideProps(): Promise<{ props: Props }> {
  const entries = await fetchEntries();

  return {
    props: {
      entries,
    },
  };
}

export default TopPage;
