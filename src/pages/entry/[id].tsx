import React, { useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { GetStaticPropsContext } from 'next';
import Head from 'next/head';
import { isNotUndefined } from 'option-t/lib/Undefinable/Undefinable';

import { EntryValue } from '../../entry/entryValue';
import { SITE_URL } from '../../constants/site_data';
import { ACCENT_COLOR, CODE_BACKGROUND_COLOR, MAIN_COLOR, TEXT_COLOR_LIGHT } from '../../common_styles/color';
import { CONTENTS_SEPARATOR_SPACE, SPACE } from '../../common_styles/space';
import { PublishedDate } from '../../components/PublishedDate';
import { EntryTagList } from '../../entry/components/EntryTagList';
import { EntryContents } from '../../entry/components/EntryContents';
import { formatYYMMDDString, formatISOString } from '../../entry/date';
import { SnsShare } from '../../entry/components/SnsShare';
import { EntryFooter } from '../../entry/components/EntryFooter';
import { SiteContents } from '../../components/SiteContents';
import { addSiteTitleToSuffix } from '../../site_title_inserter';
import { fetchEntry } from '../../entry/entryGateway';
import { getEntryIdList } from '../../entry/entryDelivery';

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

const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;

  @media (min-width: 37.5rem) {
    font-size: calc(1.5rem + ((1vw - 0.375rem) * 5.128));
  }

  @media (min-width: 52.125rem) {
    font-size: 2.25rem;
  }
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
`;

const EntryTags = styled(EntryTagList)`
  margin: calc(calc(1rem * 5) / 2) 0 !important;
`;

const GlobalStyle = createGlobalStyle`
  blockquote, p, pre, ol, ul {
    margin: calc(1rem + ${SPACE}) 0;
  }

  blockquote {
    position: relative;
    padding: ${SPACE} calc(1rem + ${SPACE});
    border: 1px solid ${ACCENT_COLOR};
  }

  blockquote > p {
    margin: 0;
  }

  blockquote::before,
  blockquote::after {
    position: absolute;
    height: 0;
    color: ${MAIN_COLOR};
    font-size: 3rem;
    font-weight: 900;
    line-height: 1;
  }

  blockquote::before {
    content: '❝';
    top: 0.3rem;
    right: calc(100% - 1.25rem);
  }

  blockquote::after {
    content: '❞';
    bottom: 2rem;
    left: calc(100% - 1.25rem);
  }

  h2 {
    margin: calc(${CONTENTS_SEPARATOR_SPACE} / 2) 0 0;
  }

  h3 {
    margin: calc(${CONTENTS_SEPARATOR_SPACE} / 3) 0 0;
  }

  h4 {
    margin: calc(${CONTENTS_SEPARATOR_SPACE} / 4) 0 0;
  }

  img {
    max-width: 100%;
  }

  pre {
    padding: calc(${SPACE} * 2);
    background-color: ${CODE_BACKGROUND_COLOR};
    color: ${TEXT_COLOR_LIGHT}
  }

  pre > code {
    white-space: pre-wrap;
  }

  ol ol,
  ul ul {
    margin: calc((1rem + ${SPACE}) / 2) 0;
  }

  .twitter-tweet {
    width: auto !important;
  }
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
      <GlobalStyle />
      <MainContents>
        <Container key={id}>
          <Header>
            <Title>{title}</Title>
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
  paths: Array<{ params: { [id: string]: string } }>;
  fallback: boolean;
}> {
  const entryIdList = getEntryIdList();
  const paths = entryIdList.map((id) => ({
    params: { id },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }: GetStaticPropsContext): Promise<{ props: Props }> {
  const entry = await fetchEntry(`${params.id}`);

  return {
    props: {
      entry,
    },
  };
}

export default Entry;
