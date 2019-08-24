import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

import { CONTENTS_SEPARATOR_SPACE, SPACE } from '../common_styles/space';
import { SITE_WIDTH } from '../common_styles/size';
import { SITE_DESCRIPTION } from '../constants';

const Footer = styled.footer`
  display: flex;
  max-width: ${SITE_WIDTH};
  margin: ${CONTENTS_SEPARATOR_SPACE} auto calc(${CONTENTS_SEPARATOR_SPACE} / 2);
  padding: 0 1rem;
`;
const Image = styled.img`
  max-width: 100%;
  margin-right: ${SPACE};
`;
const Profile = styled.p`
  margin: 0;
`;

export const SiteFooter = (): JSX.Element => (
  <Footer>
    <Image src="/static/images/icon.png" alt="このブログを作った人のアイコン" width="60" height="60" />
    <Profile>
      {SITE_DESCRIPTION}<br />
      このWebサイトではGoogle Analyticsを使っています。<Link href="/privacy"><a>プライバシーポリシーはこのリンクから見られます</a></Link>。
    </Profile>
  </Footer>
);
