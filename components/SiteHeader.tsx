import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

import { MAIN_COLOR, TEXT_COLOR_LIGHT } from '../common_styles/color';
import { SITE_WIDTH } from '../common_styles/size';
import { SPACE, CONTENTS_SEPARATOR_SPACE } from '../common_styles/space';

const Header = styled.header`
  display: flex;
  justify-content: center;
  max-width: ${SITE_WIDTH};
  margin: calc(${CONTENTS_SEPARATOR_SPACE} / 2) auto 0;
`;
const Title = styled.h1`
  display: inline-block;
  padding: 0 calc(${SPACE} * 3);
  margin: 0;
  background-color: ${MAIN_COLOR};
  font-size: 1.5rem;
  font-weight: 500;
`;
const StyledLink = styled.a`
  color: ${TEXT_COLOR_LIGHT};
  text-decoration: none;
`;

export const SiteHeader = (): JSX.Element => (
  <Header>
    <Title>
      <Link href="/" passHref>
        <StyledLink>I'm kubosho</StyledLink>
      </Link>
    </Title>
  </Header>
);
