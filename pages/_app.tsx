import React from 'react';
import App from 'next/app';
import Head from 'next/head';

import { SITE_TITLE } from '../constants/site_data';
import { MAIN_COLOR } from '../common_styles/color';
import { insertGtmScript } from '../tracking/gtm';
import { PRODUCTION_GTM_ID, DEVELOPMENT_GTM_ID } from '../tracking/gtm_id';
import { isProduction, isDevelopment } from '../constants/environment';
import { createGAOptout } from '../tracking/ga_optout';
import { activateBugsnag } from '../error_reporter/activate_bugsnag';
import { activateErrorBoundaryComponent } from '../components/ErrorBoundary';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { FoundationStyles } from '../common_styles/foundation';

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
          <link rel="alternate" type="application/rss+xml" href="/feed" title={SITE_TITLE} />
          {!gaOptout.enabled() && isProduction && insertGtmScript(PRODUCTION_GTM_ID)}
          {!gaOptout.enabled() && isDevelopment && insertGtmScript(DEVELOPMENT_GTM_ID)}
        </Head>
        <FoundationStyles />
        <SiteHeader />
        <Component {...pageProps} />
        <SiteFooter />
      </ErrorBoundary>
    );
  }
}
