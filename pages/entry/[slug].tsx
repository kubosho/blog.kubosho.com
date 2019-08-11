import React from 'react';
import styled from 'styled-components';
import { NextPageContext } from 'next';
import Head from 'next/head';

import { EntryValue } from '../../entry/entryValue';
import { SITE_TITLE } from '../../constants';
import { SiteHeader } from '../../components/SiteHeader';
import { SiteFooter } from '../../components/SiteFooter';
import entries from '../../data/entries.json';

const Container = styled.article``;
const Header = styled.header``;
const Title = styled.h1``;
const Contents = styled.div``;

type Props = {
  entry: EntryValue;
};

const Entry = (props: Props): JSX.Element => {
  const { id, title, content } = props.entry;

  const e = (
    <React.Fragment>
      <Head>
        <title>
          {title}: {SITE_TITLE}
        </title>
      </Head>
      <SiteHeader />
      <Container key={id}>
        <Header>
          <Title>{title}</Title>
        </Header>
        <Contents dangerouslySetInnerHTML={{ __html: content }} />
      </Container>
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
