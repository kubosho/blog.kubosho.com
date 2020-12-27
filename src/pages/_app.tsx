import React from 'react';

import App from 'next/app';
import Head from 'next/head';
import Link from 'next/link';
import { isUndefined } from 'option-t/lib/Undefinable/Undefinable';

import { SITE_TITLE } from '../constants/site_data';
import { MAIN_COLOR } from '../common_styles/color';
import { insertGtmScript } from '../tracking/gtm';
import { PRODUCTION_GTM_ID, DEVELOPMENT_GTM_ID } from '../tracking/gtm_id';
import { isProduction, isDevelopment } from '../constants/environment';
import { createGAOptout } from '../tracking/ga_optout';
import { activateErrorBoundaryComponent } from '../components/ErrorBoundary';

import '../common_styles/foundation.css';
import 'prismjs/themes/prism-okaidia.css';
import './variables.css';

import styles from './app.module.css';

const gtmId = isProduction ? PRODUCTION_GTM_ID : DEVELOPMENT_GTM_ID;
const gaOptout = createGAOptout(gtmId);

export default class MyApp extends App {
  render(): JSX.Element {
    const { Component, pageProps } = this.props;
    const iconUrl = '//res.cloudinary.com/kubosho/image/upload/v1589726640/icon_swqxdv.png';
    const ogImageUrl = 'https://res.cloudinary.com/kubosho/image/upload/v1598490264/og_image_xzirdr.png';
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
        <header className={styles['site-header']}>
          <h1 className={styles['site-title']}>
            <Link href="/" passHref>
              <a>{SITE_TITLE}</a>
            </Link>
          </h1>
        </header>
        <Component {...pageProps} />
        <footer className={styles['site-footer']}>
          <Link href="/privacy">
            <a>プライバシーポリシー</a>
          </Link>
          <p className={styles.copyright}>
            <small>© 2014 - 2020 kubosho</small>
          </p>
        </footer>
      </>
    );

    if (isUndefined(bugsnagApiKey)) {
      return e;
    }

    const ErrorBoundary = activateErrorBoundaryComponent(bugsnagApiKey);

    return <ErrorBoundary>{e}</ErrorBoundary>;
  }
}
