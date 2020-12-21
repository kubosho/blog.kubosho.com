import React, { useEffect } from 'react';
import styled from 'styled-components';
import { GetStaticPropsContext } from 'next';
import Head from 'next/head';
import { isNotUndefined } from 'option-t/lib/Undefinable/Undefinable';

import { EntryValue } from '../../entry/entryValue';
import { SITE_URL } from '../../constants/site_data';
import { CONTENTS_SEPARATOR_SPACE } from '../../common_styles/space';
import { PublishedDate } from '../../components/PublishedDate';
import { EntryTagList } from '../../entry/components/EntryTagList';
import { EntryContents } from '../../entry/components/EntryContents';
import { formatYYMMDDString, formatISOString } from '../../entry/date';
import { SnsShare } from '../../entry/components/SnsShare';
import { EntryFooter } from '../../entry/components/EntryFooter';
import { SiteContents } from '../../components/SiteContents';
import { addSiteTitleToSuffix } from '../../site_title_inserter';
import { getEntry, getEntryIdList } from '../../entry/entryGateway';
import { EntryContentsStyle } from '../../entry/components/EntryContentsStyle';
import { EntryTitle } from '../../entry/components/EntryTitle';

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: () => void;
      };
    };
  }
}

interface Props {
  entry: EntryValue;
}

const MainContents = styled(SiteContents)`
  padding: 0 1rem;

  @media (min-width: 52.125rem) {
    padding: 0;
  }
`;

const Container = styled.article``;

const Header = styled.header`
  position: relative;
`;

const Contents = styled(EntryContents)`
  margin-top: calc(${CONTENTS_SEPARATOR_SPACE} / 1.5);

  iframe {
    width: 100%;
    height: 56.25vh;
    min-width: 18rem;
    min-height: 9.375rem;
    max-width: 50rem;
    max-height: 28.125rem;
  }

  .twitter-tweet iframe {
    max-height: none;
  }
`;

const EntryTags = styled(EntryTagList)`
  margin: calc(calc(1rem * 5) / 2) 0 !important;
`;

const Entry = (props: Props): JSX.Element => {
  const { id, title, body, excerpt, tags, createdAt } = props.entry;
  const pageTitle = addSiteTitleToSuffix(title);
  const pageUrl = `${SITE_URL}/entry/${id}`;
  const dateTime = formatISOString(createdAt);
  const timeValue = formatYYMMDDString(createdAt);

  useEffect(() => {
    if (isNotUndefined(window.twttr)) {
      window.twttr.widgets.load();
    }
  }, []);

  const e = (
    <React.Fragment>
      <Head>
        <title>{pageTitle}</title>
        <meta property="og:title" content={pageTitle} />
        <meta name="description" content={excerpt} />
        <meta property="og:description" content={excerpt} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="article" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://platform.twitter.com" />
        <link rel="preconnect" href="https://connect.facebook.net" crossOrigin="" />
        <link rel="preconnect" href="https://platform.twitter.com" crossOrigin="" />
        <script defer src="https://connect.facebook.net/en_US/sdk.js" />
        <script defer src="https://platform.twitter.com/widgets.js" />
      </Head>
      <EntryContentsStyle />
      <MainContents>
        <Container key={id}>
          <Header>
            <EntryTitle>{title}</EntryTitle>
            <PublishedDate dateTime={dateTime}>{timeValue}</PublishedDate>
          </Header>
          <Contents dangerouslySetInnerHTML={{ __html: body }} />
          <EntryFooter>
            <SnsShare shareText={pageTitle} />
            {tags.length >= 1 && <EntryTags tags={tags} />}
          </EntryFooter>
        </Container>
      </MainContents>
    </React.Fragment>
  );

  return e;
};

export async function getStaticPaths(): Promise<{
  paths: { params: { [id: string]: string } }[];
  fallback: boolean;
}> {
  const entryIdList = await getEntryIdList();
  const paths = entryIdList.map((id) => ({
    params: { id },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }: GetStaticPropsContext): Promise<{ props: Props }> {
  const entry = await getEntry(`${params.id}`);

  return {
    props: {
      entry,
    },
  };
}

export default Entry;
