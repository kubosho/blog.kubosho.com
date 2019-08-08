import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';

import entries from '../../data/entries.json';

const Entry = styled.article``;
const Header = styled.header``;
const Title = styled.h1``;
const Contents = styled.div``;

const Post = (): JSX.Element => {
  const router = useRouter();
  const { slug } = router.query;

  // TODO: Required a computational complexity to less than "O(n)"
  const entry = entries.find(entry => entry.slug === slug);

  const e = (
    <React.Fragment>
      <Entry key={entry.id}>
        <Header>
          <Title>{entry.title}</Title>
        </Header>
        <Contents dangerouslySetInnerHTML={{ __html: entry.content }} />
      </Entry>
    </React.Fragment>
  );

  return e;
};

Post.getInitialProps = async () => {
  return {};
};

export default Post;
