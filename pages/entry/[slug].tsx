import React from 'react';
import styled from 'styled-components';
import { NextPageContext } from 'next';
import Head from 'next/head';
import { createGlobalStyle } from 'styled-components';

import { EntryValue } from '../../entry/entryValue';
import { SITE_TITLE } from '../../constants';
import { ACCENT_COLOR, MAIN_COLOR } from '../../common_styles/color';
import { CONTENTS_SEPARATOR_SPACE, SPACE } from '../../common_styles/space';
import { SITE_WIDTH } from '../../common_styles/size';
import { SiteHeader } from '../../components/SiteHeader';
import { SiteFooter } from '../../components/SiteFooter';
import entries from '../../data/entries.json';

const SiteContents = styled.main`
  max-width: ${SITE_WIDTH};
  margin: ${CONTENTS_SEPARATOR_SPACE} auto 0;
`;
const Container = styled.article``;
const Header = styled.header``;
const Title = styled.h1``;
const Contents = styled.div``;

type Props = {
  entry: EntryValue;
};

const GlobalStyle = createGlobalStyle`
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
`;

const Entry = (props: Props): JSX.Element => {
  const { id, title, content } = props.entry;

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
