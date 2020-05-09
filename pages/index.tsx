import React from 'react';
import Head from 'next/head';

import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from '../constants/site_data';
import { EntryList } from '../entry/components/EntryList';
import entries from '../data/entries.json';
import { SiteContents } from '../components/SiteContents';

const TopPage = (): JSX.Element => {
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

export default TopPage;
