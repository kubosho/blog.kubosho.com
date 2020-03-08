import React from 'react';
import Document, { Main, NextScript, Head } from 'next/document';
import { insertGtmNoscript } from '../tracking/gtm_noscript';
import { PRODUCTION_GTM_ID, DEVELOPMENT_GTM_ID } from '../tracking/gtm_id';
import { isProduction, isDevelopment } from './environment';

export default class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <html lang="ja">
        <Head />
        <body>
          {isProduction && insertGtmNoscript(PRODUCTION_GTM_ID)}
          {isDevelopment && insertGtmNoscript(DEVELOPMENT_GTM_ID)}
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
