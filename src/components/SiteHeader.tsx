import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

import { MAIN_COLOR } from '../common_styles/color';
import { SITE_TITLE } from '../constants/site_data';
import { SITE_TITLE_FONT_FAMILY } from '../common_styles/text';

const Header = styled.header`
  height: calc(100vw - 45.875rem);
  min-height: 60px;
  max-height: 100px;
  text-align: center;
`;

const Title = styled.h1`
  display: flex;
  align-items: center;
  position: relative;
  max-width: 50rem;
  height: 100%;
  padding-left: 20px;
  margin: 0 auto;
  border-left: 40px solid ${MAIN_COLOR};
  font-family: ${SITE_TITLE_FONT_FAMILY};
  font-size: 1.375rem;
  font-weight: 500;

  &::before {
    content: '';
    display: block;
    position: absolute;
    left: calc(-100vw - 40px);
    background-color: ${MAIN_COLOR};
    width: 100vw;
    height: 100%;
  }

  @media (min-width: 37.5rem) {
    font-size: calc(1.375rem + ((1vw - 0.375rem) * 5.982));
  }

  @media (min-width: 52.125rem) {
    font-size: 2.25rem;
  }
`;

const StyledLink = styled.a`
  color: ${MAIN_COLOR};
  text-decoration: none;
`;

export const SiteHeader = (): JSX.Element => {
  const e = (
    <Header>
      <Title>
        <Link href="/" passHref>
          <StyledLink>{SITE_TITLE}</StyledLink>
        </Link>
      </Title>
    </Header>
  );

  return e;
};
