import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';

import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { CONTENTS_SEPARATOR_SPACE } from '../common_styles/space';
import { SITE_WIDTH } from '../common_styles/size';
import { SITE_TITLE, SITE_URL } from '../constants';

const SiteContents = styled.main`
  max-width: ${SITE_WIDTH};
  margin: ${CONTENTS_SEPARATOR_SPACE} auto 0;
  padding: 0 1rem;
`;

const PrivacyPolicyPage = (): JSX.Element => {
  const pageTitle = `プライバシーポリシー: ${SITE_TITLE}`;
  const e = (
    <React.Fragment>
      <Head>
        <title>{pageTitle}</title>
        <meta property="og:title" content={pageTitle} />
        <meta property="og:url" content={`${SITE_URL}/privacy`} />
      </Head>
      <SiteHeader />
      <SiteContents>
        <p>当ブログでは内容の改善を目的として、Googleアナリティクスによるアクセス分析をおこなっています。</p>
        <p>
          Googleアナリティクスは、Cookie(クッキー)により、匿名のトラフィックデータを収集しています。
          <br />
          Cookieに含まれるデータは利用者の個人情報を特定しません。利用者はCookieを無効にした状態で当サイトにアクセスできます。
        </p>
        <p>
          詳しくは
          <a href="https://policies.google.com/technologies/partner-sites">
            Google のサービスを使用するサイトやアプリから収集した情報の Google による使用 – ポリシーと規約 – Google
          </a>
          を参照してください。
        </p>
      </SiteContents>
      <SiteFooter />
    </React.Fragment>
  );

  return e;
};

export default PrivacyPolicyPage;
