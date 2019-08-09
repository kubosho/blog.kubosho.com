import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const Header = styled.header``;
const Title = styled.h1``;

export const SiteHeader = (): JSX.Element => (
  <Header>
    <Title>
      <Link href="/">
        <a>I'm kubosho</a>
      </Link>
    </Title>
  </Header>
);
