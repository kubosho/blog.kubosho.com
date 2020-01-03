import React, { useEffect } from 'react';
import styled from 'styled-components';
import { NextPageContext } from 'next';
import Head from 'next/head';
import { createGlobalStyle } from 'styled-components';
import { isNotUndefined } from 'option-t/lib/Undefinable/Undefinable';

import { EntryValue } from '../../entry/entryValue';
import { SITE_TITLE, SITE_URL } from '../../constants';
import { ACCENT_COLOR, CODE_BACKGROUND_COLOR, MAIN_COLOR, TEXT_COLOR_LIGHT } from '../../common_styles/color';
import { CONTENTS_SEPARATOR_SPACE, SPACE } from '../../common_styles/space';
import { SITE_WIDTH } from '../../common_styles/size';
import { PublishedDate } from '../../components/PublishedDate';
import { SiteHeader } from '../../components/SiteHeader';
import { SiteFooter } from '../../components/SiteFooter';
import entries from '../../data/entries.json';

declare global {
  interface Window {
    FB?: {
      XFBML: {
        parse: () => void;
      };
    };
    twttr?: {
      widgets: {
        load: () => void;
      };
    };
  }
}

type Props = {
  entry: EntryValue;
};

const SiteContents = styled.main`
  max-width: ${SITE_WIDTH};
  margin: ${CONTENTS_SEPARATOR_SPACE} auto 0;
  padding: 0 1rem;
`;
const Container = styled.article``;
const Header = styled.header`
  position: relative;
  border-bottom: 4px solid ${MAIN_COLOR};
`;
const Date = styled.div`
  color: rgba(0, 0, 0, 0.75);

  @media (min-width: 67.5rem) {
    position: absolute;
    top: ${SPACE};
    left: calc(${CONTENTS_SEPARATOR_SPACE} * -1.5);
  }
`;
const Title = styled.h1`
  margin: 0;
  line-height: 1.4;
`;
const Contents = styled.div`
  margin-top: calc(${CONTENTS_SEPARATOR_SPACE} / 1.5);
`;
const Footer = styled.footer``;
const SnsButtons = styled.ul`
  display: flex;
  padding: 0;
  margin: calc(${CONTENTS_SEPARATOR_SPACE} / 4) 0 0;
  list-style: none;
  line-height: 1;
`;
const TweetButtonContainer = styled.li`
  margin-right: calc(${CONTENTS_SEPARATOR_SPACE} / 6);
`;
const LikeButtonContainer = styled.li``;

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
  const { id, slug, title, content, excerpt, createdAt } = props.entry;
  const pageTitle = `${title}: ${SITE_TITLE}`;
  const pageUrl = `${SITE_URL}/entry/${slug}`;

  useEffect(() => {
    if (isNotUndefined(window.FB)) {
      window.FB.XFBML.parse();
    }

    if (isNotUndefined(window.twttr)) {
      window.twttr.widgets.load();
    }
  }, []);

  const e = (
    <React.Fragment>
      <Head>
        <title>{pageTitle}</title>
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={excerpt} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="article" />
        <meta
          property="og:image"
          content="//images.ctfassets.net/jkycobgkkwnp/7bcr2cdqYngCIxVADlPZlf/077f0b93c117018d56f51df99ac18e0b/og_image.png"
        />
      </Head>
      <GlobalStyle />
      <SiteHeader />
      <SiteContents>
        <Container key={id}>
          <Header>
            <Title>{title}</Title>
            <Date>
              <PublishedDate createdAt={createdAt} />
            </Date>
          </Header>
          <Contents dangerouslySetInnerHTML={{ __html: content }} />
          <Footer>
            <SnsButtons>
              <TweetButtonContainer>
                <a className="twitter-share-button" href="https://twitter.com/intent/tweet">
                  Tweet
                </a>
              </TweetButtonContainer>
              <LikeButtonContainer>
                <div
                  className="fb-like"
                  data-href={pageUrl}
                  data-width=""
                  data-layout="button_count"
                  data-action="like"
                  data-size="small"
                  data-show-faces="false"
                  data-share="false"
                />
              </LikeButtonContainer>
            </SnsButtons>
          </Footer>
        </Container>
      </SiteContents>
      <SiteFooter />
    </React.Fragment>
  );

  return e;
};

Entry.getInitialProps = ({ query }: NextPageContext) => {
  // TODO: Required a computational complexity to less than "O(n)"
  const entry = entries.find(entry => entry.slug === query.slug);

  return {
    entry,
  };
};

export default Entry;
