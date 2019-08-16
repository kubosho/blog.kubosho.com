import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

import { SITE_WIDTH } from '../common_styles/size';

const Header = styled.header`
  max-width: ${SITE_WIDTH};
  margin: 0 auto;
`;
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
