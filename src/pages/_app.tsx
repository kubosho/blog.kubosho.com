import React from 'react';

import App from 'next/app';
import Head from 'next/head';
import Link from 'next/link';
import { isUndefined } from 'option-t/lib/Undefinable/Undefinable';

import {
  AUTHOR,
  FACEBOOK_APP_ID,
  FAVICON_URL,
  OG_IMAGE_URL,
  SITE_TITLE,
  TWITTER_ACCOUNT_ID,
} from '../constants/site_data';
import { insertGtmScript } from '../tracking/gtm';
import { PRODUCTION_GTM_ID, DEVELOPMENT_GTM_ID } from '../tracking/gtm_id';
import { IS_PRODUCTION_ENV, IS_DEVELOPMENT_ENV, BUGSNAG_API_KEY } from '../constants/environment';
import { createGAOptout } from '../tracking/ga_optout';
import { activateErrorBoundaryComponent } from '../components/ErrorBoundary';

import '../common_styles/foundation.css';
import 'prismjs/themes/prism-okaidia.css';
import './variables.css';

import styles from './app.module.css';
import { PathList } from '../constants/path_list';

const BLUE_600 = '#003760';
const MAIN_COLOR = BLUE_600;

const gtmId = IS_PRODUCTION_ENV ? PRODUCTION_GTM_ID : DEVELOPMENT_GTM_ID;
const gaOptout = createGAOptout(gtmId);

export default class MyApp extends App {
  render(): JSX.Element {
    const { Component, pageProps } = this.props;

    const element = (
      <>
        <Head>
          <meta name="theme-color" content={MAIN_COLOR} />
          <meta property="og:site_name" content={SITE_TITLE} />
          <meta property="og:image" content={OG_IMAGE_URL} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="fb:app_id" content={FACEBOOK_APP_ID} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta property="twitter:image" content={OG_IMAGE_URL} />
          <meta name="twitter:site" content={`@${TWITTER_ACCOUNT_ID}`} />
          <link rel="apple-touch-icon" href={FAVICON_URL} />
          <link rel="icon" type="image/png" href={FAVICON_URL} />
          <link rel="alternate" type="application/rss+xml" href={PathList.Feed} title={SITE_TITLE} />
          {!gaOptout.enabled() && IS_PRODUCTION_ENV && insertGtmScript(PRODUCTION_GTM_ID)}
          {!gaOptout.enabled() && IS_DEVELOPMENT_ENV && insertGtmScript(DEVELOPMENT_GTM_ID)}
        </Head>
        <header className={styles['site-header']}>
          <h1 className={styles['site-title']}>
            <Link href={PathList.Root} passHref>
              <a>{SITE_TITLE}</a>
            </Link>
          </h1>
        </header>
        <Component {...pageProps} />
        <footer className={styles['site-footer']}>
          <ul className={styles['site-navigation']}>
            <li>
              <Link href={PathList.Feed}>
                <a>フィード</a>
              </Link>
            </li>
            <li>
              <Link href={PathList.Policy}>
                <a>ポリシー</a>
              </Link>
            </li>
          </ul>
          <p className={styles.copyright}>
            <small>© {AUTHOR}</small>
          </p>
        </footer>
      </>
    );

    if (isUndefined(BUGSNAG_API_KEY)) {
      return element;
    }

    const ErrorBoundary = activateErrorBoundaryComponent(BUGSNAG_API_KEY);

    return <ErrorBoundary>{element}</ErrorBoundary>;
  }
}
