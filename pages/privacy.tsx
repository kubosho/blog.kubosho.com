import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';

import { MAIN_COLOR } from '../common_styles/color';
import { CONTENTS_SEPARATOR_SPACE } from '../common_styles/space';
import { SITE_WIDTH } from '../common_styles/size';
import { SITE_TITLE, SITE_URL } from '../constants/site_data';
import { GAOptout, createGAOptout } from '../tracking/ga_optout';
import { isProduction } from '../constants/environment';
import { PRODUCTION_GTM_ID, DEVELOPMENT_GTM_ID } from '../tracking/gtm_id';

const SiteContents = styled.main`
  max-width: ${SITE_WIDTH};
  margin: ${CONTENTS_SEPARATOR_SPACE} auto 0;
  padding: 0 1rem;
`;

const Title = styled.h1`
  border-bottom: 4px solid ${MAIN_COLOR};
  font-size: 2.25rem;
  line-height: 1.2;
`;

const SubTitle = styled.h2`
  font-size: 1.5rem;
  line-height: 1.2;
`;

const Contents = styled.div`
  margin-top: calc(${CONTENTS_SEPARATOR_SPACE} / 1.5);
`;

const gtmId = isProduction ? PRODUCTION_GTM_ID : DEVELOPMENT_GTM_ID;

const OPTOUT_ENABLE_TEXT = 'アクセス解析を有効にする';
const OPTOUT_DISABLE_TEXT = 'アクセス解析を無効にする';

const optout = createGAOptout(gtmId);
const initialOptoutText = optout.enabled() ? OPTOUT_ENABLE_TEXT : OPTOUT_DISABLE_TEXT;

const PrivacyPolicyPage = (): JSX.Element => {
  const pageTitle = `プライバシーポリシー: ${SITE_TITLE}`;

  const [optoutText, setOptoutText] = React.useState(initialOptoutText);

  const e = (
    <React.Fragment>
      <Head>
        <title>{pageTitle}</title>
        <meta property="og:title" content={pageTitle} />
        <meta property="og:url" content={`${SITE_URL}/privacy`} />
      </Head>
      <SiteContents>
        <Title>プライバシーポリシー</Title>
        <Contents>
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
        </Contents>
        <SubTitle>アクセス解析の有効・無効を切り替える</SubTitle>
        <p>
          現在アクセス解析は<b>{optout.enabled() ? '無効' : '有効'}</b>になっています。
        </p>
        <button
          type="button"
          onClick={() => {
            onClickOptoutButton(optout, setOptoutText);
          }}
        >
          {optoutText}
        </button>
      </SiteContents>
    </React.Fragment>
  );

  return e;
};

function onClickOptoutButton(optoutInstance: GAOptout, callback: (value: string) => void): void {
  if (optoutInstance.enabled()) {
    callback(OPTOUT_DISABLE_TEXT);
    optoutInstance.disable();
  } else {
    callback(OPTOUT_ENABLE_TEXT);
    optoutInstance.enable();
  }
}

export default PrivacyPolicyPage;
