import React from 'react';
import styled from 'styled-components';
import { NextPageContext } from 'next';
import Head from 'next/head';
import { createGlobalStyle } from 'styled-components';

import { EntryValue } from '../../entry/entryValue';
import { SITE_TITLE } from '../../constants';
import { ACCENT_COLOR, MAIN_COLOR, TEXT_COLOR_LIGHT } from '../../common_styles/color';
import { CONTENTS_SEPARATOR_SPACE, SPACE } from '../../common_styles/space';
import { SITE_WIDTH } from '../../common_styles/size';
import { PublishedDate } from '../../components/PublishedDate';
import { SiteHeader } from '../../components/SiteHeader';
import { SiteFooter } from '../../components/SiteFooter';
import entries from '../../data/entries.json';

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
    top: calc(${SPACE} * 2);
    left: calc(-5.8rem - ${SPACE} * 4.5);
  }
`;
const Title = styled.h1`
  margin: 0;
  line-height: 1.4;
`;
const Contents = styled.div`
  margin-top: calc(${CONTENTS_SEPARATOR_SPACE} / 1.5);
`;

type Props = {
  entry: EntryValue;
};

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
    background-color: ${MAIN_COLOR};
    color: ${TEXT_COLOR_LIGHT};
  }

  pre > code {
    white-space: pre-wrap;
  }
`;

const Entry = (props: Props): JSX.Element => {
  const { id, title, content, createdAt } = props.entry;

  const e = (
    <React.Fragment>
      <Head>
        <title>
          {title}: {SITE_TITLE}
        </title>
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
        </Container>
      </SiteContents>
      <SiteFooter />
    </React.Fragment>
  );

  return e;
};

Entry.getInitialProps = async ({ query }: NextPageContext) => {
  // TODO: Required a computational complexity to less than "O(n)"
  const entry = entries.find(entry => entry.slug === query.slug);

  return {
    entry,
  };
};

export default Entry;
