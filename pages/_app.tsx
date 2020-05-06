import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import { createGlobalStyle } from 'styled-components';

import { SITE_TITLE } from '../constants/site_data';
import { BACKGROUND_COLOR, MAIN_COLOR, TEXT_COLOR } from '../common_styles/color';
import { BASE_FONT_SIZE, FONT_FAMILY, LINE_HEIGHT, PROGRAMMING_FONT_FAMILY } from '../common_styles/text';
import { SPACE } from '../common_styles/space';
import { insertGtmScript } from '../tracking/gtm';
import { PRODUCTION_GTM_ID, DEVELOPMENT_GTM_ID } from '../tracking/gtm_id';
import { isProduction, isDevelopment } from '../constants/environment';
import { createGAOptout } from '../tracking/ga_optout';
import { activateBugsnag } from '../error_reporter/activate_bugsnag';
import { activateErrorBoundaryComponent } from '../components/ErrorBoundary';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';

const GlobalStyle = createGlobalStyle`
  html {
    overflow-x: hidden;
  }

  body {
    background-color: ${BACKGROUND_COLOR};
    color: ${TEXT_COLOR};
    font-family: ${FONT_FAMILY};
    font-weight: 500;
    font-feature-settings: 'palt';
    text-rendering: optimizeLegibility;
    font-size: ${BASE_FONT_SIZE};
    line-height: ${LINE_HEIGHT};
    overflow: hidden;
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

const gtmId = isProduction ? PRODUCTION_GTM_ID : DEVELOPMENT_GTM_ID;
const gaOptout = createGAOptout(gtmId);

export default class MyApp extends App {
  render(): JSX.Element {
    const { Component, pageProps } = this.props;

    activateBugsnag(process.env.BUGSNAG_API_KEY);
    const ErrorBoundary = activateErrorBoundaryComponent();

    return (
      <ErrorBoundary>
        <Head>
          <meta name="theme-color" content={MAIN_COLOR} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@kubosho_" />
          <link rel="apple-touch-icon" href="/static/images/icon.png" />
          <link rel="icon" type="image/png" href="/static/images/icon.png" />
          <link rel="stylesheet" href="/static/styles/foundation.css" />
          <link rel="alternate" type="application/rss+xml" href="/feed" title={SITE_TITLE} />
          {!gaOptout.enabled() && isProduction && insertGtmScript(PRODUCTION_GTM_ID)}
          {!gaOptout.enabled() && isDevelopment && insertGtmScript(DEVELOPMENT_GTM_ID)}
        </Head>
        <GlobalStyle />
        <SiteHeader />
        <Component {...pageProps} />
        <SiteFooter />
      </ErrorBoundary>
    );
  }
}
