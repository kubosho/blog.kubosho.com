import React from 'react';
import styled from 'styled-components';
import { NextPageContext } from 'next';

import entries from '../../data/entries.json';
import { EntryValue } from '../../entry/entryValue';

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
      <Container key={id}>
        <Header>
          <Title>{title}</Title>
        </Header>
        <Contents dangerouslySetInnerHTML={{ __html: content }} />
      </Container>
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
