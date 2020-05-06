import React, { useEffect } from 'react';
import styled from 'styled-components';
import { NextPageContext } from 'next';
import Head from 'next/head';
import { createGlobalStyle } from 'styled-components';
import { isNotUndefined } from 'option-t/lib/Undefinable/Undefinable';

import { EntryValue } from '../../entry/entryValue';
import { SITE_TITLE, SITE_URL } from '../../constants/site_data';
import { ACCENT_COLOR, CODE_BACKGROUND_COLOR, MAIN_COLOR, TEXT_COLOR_LIGHT } from '../../common_styles/color';
import { CONTENTS_SEPARATOR_SPACE, SPACE } from '../../common_styles/space';
import { SITE_WIDTH } from '../../common_styles/size';
import { PublishedDate, PublishedDateContainer } from '../../components/PublishedDate';
import { EntryTagList } from '../../entry/components/EntryTagList';
import { EntryContents } from '../../entry/components/EntryContents';
import { formatYYMMDDString, formatISOString } from '../../entry/date';
import entries from '../../data/entries.json';
import { SnsShare } from '../../entry/components/SnsShare';
import { EntryFooter } from '../../entry/components/EntryFooter';

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

const SiteContents = styled.main`
  max-width: ${SITE_WIDTH};
  margin: ${CONTENTS_SEPARATOR_SPACE} auto 0;
  padding: 0 1rem;
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
    margin: calc(1rem - ${SPACE}) 0;
  }

  blockquote {
    position: relative;
    padding: ${SPACE} calc(1rem + ${SPACE});
    border: ${ACCENT_COLOR} dashed;
    border-width: 1px 0;
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
    right: calc(100% - 1rem);
  }

  blockquote::after {
    content: '❞';
    bottom: 2rem;
    left: calc(100% - 1rem);
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
`;

const Entry = (props: Props): JSX.Element => {
  const { id, slug, title, content, excerpt, tags, createdAt } = props.entry;
  const pageTitle = `${title}: ${SITE_TITLE}`;
  const pageUrl = `${SITE_URL}/entry/${slug}`;
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
        <meta property="og:site_name" content={SITE_TITLE} />
        <meta property="og:description" content={excerpt} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="article" />
        <meta
          property="og:image"
          content="//images.ctfassets.net/jkycobgkkwnp/7bcr2cdqYngCIxVADlPZlf/077f0b93c117018d56f51df99ac18e0b/og_image.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="fb:app_id" content="2453282784920956" />
      </Head>
      <GlobalStyle />
      <SiteContents>
        <Container key={id}>
          <Header>
            <Title>{title}</Title>
            <PublishedDateContainer>
              <PublishedDate dateTime={dateTime}>{timeValue}</PublishedDate>
            </PublishedDateContainer>
          </Header>
          <Contents dangerouslySetInnerHTML={{ __html: content }} />
          <EntryFooter>
            <SnsShare shareText={pageTitle} />
            {tags.length >= 1 && <EntryTags tags={tags} />}
          </EntryFooter>
        </Container>
      </SiteContents>
    </React.Fragment>
  );

  return e;
};

Entry.getInitialProps = ({ query }: NextPageContext) => {
  // TODO: Required a computational complexity to less than "O(n)"
  const entry = entries.find((entry) => entry.slug === query.slug);

  return {
    entry,
  };
};

export default Entry;
