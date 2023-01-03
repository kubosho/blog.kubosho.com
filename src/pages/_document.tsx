import Document, { Html, Main, NextScript, Head, DocumentInitialProps } from 'next/document';

import { BASE_LANGUAGE } from '../constants/site_data';
import { GTM_ID } from '../tracking/gtm_id';
import { createGAOptout } from '../tracking/ga_optout';
import { insertGtmNoscript } from '../tracking/gtm';

type Props = {
  styles: JSX.Element;
} & DocumentInitialProps;

const gaOptout = createGAOptout(GTM_ID);

export default class MyDocument extends Document<Props> {
  render(): JSX.Element {
    return (
      <Html lang={BASE_LANGUAGE}>
        <Head>
          <link rel="dns-prefetch" href="https://www.google-analytics.com" />
          <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
          <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="" />
          <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="" />
        </Head>
        <body>
          {!gaOptout.enabled() && insertGtmNoscript(GTM_ID)}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
