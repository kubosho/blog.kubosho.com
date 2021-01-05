import React from 'react';
import Document, { Html, Main, NextScript, Head, DocumentInitialProps } from 'next/document';
import { FACEBOOK_APP_ID } from '../constants/site_data';

type Props = {
  styles: JSX.Element;
} & DocumentInitialProps;

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
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
