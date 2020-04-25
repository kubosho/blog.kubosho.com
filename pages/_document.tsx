import React from 'react';
import Document, { Main, NextScript, Head } from 'next/document';
import { insertGtmNoscript } from '../tracking/gtm_noscript';
import { PRODUCTION_GTM_ID, DEVELOPMENT_GTM_ID } from '../tracking/gtm_id';
import { isProduction, isDevelopment } from '../constants/environment';
import { createGAOptout } from '../tracking/ga_optout';

const gtmId = isProduction ? PRODUCTION_GTM_ID : DEVELOPMENT_GTM_ID;
const gaOptout = createGAOptout(gtmId);

export default class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <html lang="ja">
        <Head />
        <body>
          <div id="fb-root" />
          {!gaOptout.enabled() && isProduction && insertGtmNoscript(PRODUCTION_GTM_ID)}
          {!gaOptout.enabled() && isDevelopment && insertGtmNoscript(DEVELOPMENT_GTM_ID)}
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
