import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import { createGlobalStyle } from 'styled-components';

import { SITE_TITLE } from '../constants';
import { BACKGROUND_COLOR, MAIN_COLOR, TEXT_COLOR } from '../common_styles/color';
import { BASE_FONT_SIZE, FONT_FAMILY, LINE_HEIGHT, PROGRAMMING_FONT_FAMILY } from '../common_styles/text';
import { SPACE } from '../common_styles/space';
import { insertGtmScript } from '../tracking/gtm';
import { PRODUCTION_GTM_ID, DEVELOPMENT_GTM_ID } from '../tracking/gtm_id';
import { isProduction, isDevelopment } from './environment';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${BACKGROUND_COLOR};
    color: ${TEXT_COLOR};
    font-family: ${FONT_FAMILY};
    font-weight: 500;
    font-feature-settings: 'palt';
    text-rendering: optimizeLegibility;
    font-size: ${BASE_FONT_SIZE};
    line-height: ${LINE_HEIGHT};
    overflow-x: hidden;
  }

  code {
    padding: 0 ${SPACE};
    border: 1px dotted ${MAIN_COLOR};
    font-family: ${PROGRAMMING_FONT_FAMILY};
  }

  pre code {
    padding: 0;
    border: none;
  }
`;

export default class MyApp extends App {
  render(): JSX.Element {
    const { Component, pageProps } = this.props;

    return (
      <>
        <Head>
          <meta name="theme-color" content={MAIN_COLOR} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@kubosho_" />
          <link rel="apple-touch-icon" href="/static/images/icon.png" />
          <link rel="icon" type="image/png" href="/static/images/icon.png" />
          <link rel="stylesheet" href="/static/styles/foundation.css" />
          <link rel="alternate" type="application/rss+xml" href="/feed" title={SITE_TITLE} />
          {isProduction && insertGtmScript(PRODUCTION_GTM_ID)}
          {isDevelopment && insertGtmScript(DEVELOPMENT_GTM_ID)}
          <script
            async
            defer
            crossOrigin="anonymous"
            src="https://connect.facebook.net/ja_JP/sdk.js#xfbml=1&version=v4.0"
          />
          <script async defer src="https://platform.twitter.com/widgets.js" />
        </Head>
        <GlobalStyle />
        <Component {...pageProps} />
      </>
    );
  }
}
