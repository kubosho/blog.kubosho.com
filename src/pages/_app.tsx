import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import { isUndefined } from 'option-t/lib/Undefinable/Undefinable';

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
    const iconUrl = '//res.cloudinary.com/kubosho/image/upload/v1589726640/icon_swqxdv.png';
    const ogImageUrl = 'https://res.cloudinary.com/kubosho/image/upload/v1589722423/og_image_ltlxax.png';
    const bugsnagApiKey = process.env.BUGSNAG_API_KEY;

    const e = (
      <>
        <Head>
          <meta name="theme-color" content={MAIN_COLOR} />
          <meta property="og:site_name" content={SITE_TITLE} />
          <meta property="og:image" content={ogImageUrl} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="fb:app_id" content="2453282784920956" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta property="twitter:image" content={ogImageUrl} />
          <meta name="twitter:site" content="@kubosho_" />
          <link rel="apple-touch-icon" href={iconUrl} />
          <link rel="icon" type="image/png" href={iconUrl} />
          <link rel="alternate" type="application/rss+xml" href="/feed" title={SITE_TITLE} />
          {!gaOptout.enabled() && isProduction && insertGtmScript(PRODUCTION_GTM_ID)}
          {!gaOptout.enabled() && isDevelopment && insertGtmScript(DEVELOPMENT_GTM_ID)}
        </Head>
        <FoundationStyles />
        <SiteHeader />
        <Component {...pageProps} />
        <SiteFooter />
      </>
    );

    if (isUndefined(bugsnagApiKey)) {
      return e;
    }

    activateBugsnag(bugsnagApiKey);
    const ErrorBoundary = activateErrorBoundaryComponent();

    return <ErrorBoundary>{e}</ErrorBoundary>;
  }
}
