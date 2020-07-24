import React from 'react';
import { ServerStyleSheet } from 'styled-components';
import Document, { Main, NextScript, Head, DocumentContext, DocumentInitialProps } from 'next/document';
import { insertGtmNoscript } from '../tracking/gtm_noscript';
import { PRODUCTION_GTM_ID, DEVELOPMENT_GTM_ID } from '../tracking/gtm_id';
import { isProduction, isDevelopment } from '../constants/environment';
import { createGAOptout } from '../tracking/ga_optout';
import { FACEBOOK_APP_ID } from '../constants/site_data';

type Props = {
  styles: JSX.Element;
} & DocumentInitialProps;

const gtmId = isProduction ? PRODUCTION_GTM_ID : DEVELOPMENT_GTM_ID;
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
      <html lang="ja">
        <Head>
          <link rel="dns-prefetch" href="https://www.google-analytics.com" />
          <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
          <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="" />
          <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="" />
        </Head>
        <body>
          <script dangerouslySetInnerHTML={{ __html: sdkInitialScript }} />
          {!gaOptout.enabled() && isProduction && insertGtmNoscript(PRODUCTION_GTM_ID)}
          {!gaOptout.enabled() && isDevelopment && insertGtmNoscript(DEVELOPMENT_GTM_ID)}
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

export async function getStaticProps(ctx: DocumentContext): Promise<Props> {
  const sheet = new ServerStyleSheet();
  const originalRenderPage = ctx.renderPage;

  try {
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
      });

    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          {sheet.getStyleElement()}
        </>
      ),
    };
  } finally {
    sheet.seal();
  }
}
