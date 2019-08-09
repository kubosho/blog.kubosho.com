import React from 'react';
import styled from 'styled-components';

const Footer = styled.footer``;
const FooterInner = styled.div``;
const Profile = styled.p``;

export const SiteFooter = (): JSX.Element => (
  <Footer>
    <FooterInner>
      <img src="/static/images/kubosho.jpg" alt="このブログを作った人のアイコン" width="60" height="60" />
      <Profile>
        kuboshoの個人ブログです。仕事で携わっているソフトウェア開発や、ダーツやゲームなどの趣味について書きます。
      </Profile>
    </FooterInner>
  </Footer>
);
