import React from 'react';
import Head from 'next/head';

import { SITE_URL } from '../constants/site_data';
import { EntryList } from '../components/EntryList';
import { SiteContents } from '../components/SiteContents';
import { EntryValue } from '../entry/entry_value';
import { getEntryList } from '../entry/entry_gateway';
import { retrieveTranslation } from '../locales/i18n';

interface Props {
  entries: Array<EntryValue>;
}

const TopPage = (props: Props): JSX.Element => {
  const { entries } = props;
  const title = retrieveTranslation('website.title');
  const description = retrieveTranslation('website.description');

  const e = (
    <React.Fragment>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:type" content="website" />
      </Head>
      <SiteContents>
        <EntryList title={retrieveTranslation('top.headings.entryList')} entries={entries} />
      </SiteContents>
    </React.Fragment>
  );

  return e;
};

export async function getStaticProps(): Promise<{ props: Props }> {
  const entries = await getEntryList();

  return {
    props: {
      entries,
    },
  };
}

export default TopPage;
