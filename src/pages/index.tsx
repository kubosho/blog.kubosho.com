import React from 'react';
import styled from 'styled-components';
import Head from 'next/head';

import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from '../constants/site_data';
import { EntryList } from '../entry/components/EntryList';
import { PageDescription } from '../components/PageDescription';
import { SiteContents } from '../components/SiteContents';
import { EntryValue } from '../entry/entryValue';
import { fetchEntries } from '../entry/entryGateway';
import { CONTENTS_SEPARATOR_SPACE, SPACE } from '../common_styles/space';

interface Props {
  entries: Array<EntryValue>;
}

const ModifiedPageDescription = styled(PageDescription)`
  padding: 0 calc(${SPACE} * 3);
  margin: 0 auto ${CONTENTS_SEPARATOR_SPACE};

  @media (min-width: 52.125rem) {
    padding: 0;
    margin: 0 auto calc(${CONTENTS_SEPARATOR_SPACE} * 1.5);
  }
`;

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
        <ModifiedPageDescription>{SITE_DESCRIPTION}</ModifiedPageDescription>
        <EntryList entries={entries} />
      </SiteContents>
    </React.Fragment>
  );

  return e;
};

export async function getStaticProps(): Promise<{ props: Props }> {
  const entries = await fetchEntries();

  return {
    props: {
      entries,
    },
  };
}

export default TopPage;
