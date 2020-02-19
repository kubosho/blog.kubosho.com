import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

import { SITE_WIDTH } from '../common_styles/size';
import { NOTE_FONT_SIZE } from '../common_styles/text';
import { SPACE } from '../common_styles/space';
import { TEXT_COLOR_LIGHT, MAIN_COLOR, ACCENT_COLOR, LINK_COLOR } from '../common_styles/color';

const Footer = styled.footer`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: ${SITE_WIDTH};
  height: calc(100vw - 45.875rem);
  padding-left: calc(${SPACE} * 3);
  min-height: 60px;
  max-height: 100px;
  margin: calc(${SPACE} * 15) auto 0;

  @media (min-width: 52.125rem) {
    padding-left: 0;
  }

  a:link,
  a:visited {
    color: ${LINK_COLOR};
  }
`;

const Copyright = styled.p`
  display: flex;
  align-items: center;
  position: relative;
  height: 100%;
  padding: 0 calc(${SPACE} * 5);
  margin-left: calc(${SPACE} * 5);
  color: ${TEXT_COLOR_LIGHT};
  font-size: ${NOTE_FONT_SIZE};

  &::before,
  &::after {
    content: '';
    display: block;
    position: absolute;
    height: 100%;
  }

  &::before {
    left: -4.197vw;
    width: 4.197vw;
    background-color: ${ACCENT_COLOR};
  }

  &::after {
    left: 0;
    z-index: -1;
    width: 100vw;
    background-color: ${MAIN_COLOR};
  }
`;

export const SiteFooter = (): JSX.Element => (
  <Footer>
    <Link href="/privacy">
      <a>プライバシーポリシー</a>
    </Link>
    <Copyright>
      <small>© 2014 - 2020 kubosho</small>
    </Copyright>
  </Footer>
);
