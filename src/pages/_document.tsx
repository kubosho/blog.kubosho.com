import React from 'react';
import Document, { Html, Main, NextScript, Head, DocumentInitialProps } from 'next/document';
import { insertGtmNoscript } from '../tracking/gtm_noscript';
import { PRODUCTION_GTM_ID, DEVELOPMENT_GTM_ID } from '../tracking/gtm_id';
import { IS_PRODUCTION_ENV, IS_DEVELOPMENT_ENV } from '../constants/environment';
import { createGAOptout } from '../tracking/ga_optout';
import { FACEBOOK_APP_ID } from '../constants/site_data';

type Props = {
  styles: JSX.Element;
} & DocumentInitialProps;

const gtmId = IS_PRODUCTION_ENV ? PRODUCTION_GTM_ID : DEVELOPMENT_GTM_ID;
const gaOptout = createGAOptout(gtmId);

const sdkInitialScript = `
  window.fbAsyncInit = function() {
    FB.init({
      appId            : ${FACEBOOK_APP_ID},
      autoLogAppEvents : true,
      xfbml            : true,
      version          : 'v6.0'
    });
  };
`;

export default class MyDocument extends Document<Props> {
  render(): JSX.Element {
    return (
      <Html lang="ja">
        <Head>
          <link rel="dns-prefetch" href="https://www.google-analytics.com" />
          <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
          <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="" />
          <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="" />
        </Head>
        <body>
          <script dangerouslySetInnerHTML={{ __html: sdkInitialScript }} />
          {!gaOptout.enabled() && IS_PRODUCTION_ENV && insertGtmNoscript(PRODUCTION_GTM_ID)}
          {!gaOptout.enabled() && IS_DEVELOPMENT_ENV && insertGtmNoscript(DEVELOPMENT_GTM_ID)}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
