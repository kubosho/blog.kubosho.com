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
        <meta itemProp="name" content={SITE_TITLE} />
        <meta property="og:title" content={SITE_TITLE} />
        <meta property="og:site_name" content={SITE_TITLE} />
        <meta property="og:description" content={SITE_DESCRIPTION} />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="//images.ctfassets.net/jkycobgkkwnp/7bcr2cdqYngCIxVADlPZlf/077f0b93c117018d56f51df99ac18e0b/og_image.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="fb:app_id" content="2453282784920956" />
      </Head>
      <SiteContents>
        <EntryList entries={entries} />
      </SiteContents>
    </React.Fragment>
  );

  return e;
};

export default TopPage;
