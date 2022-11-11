import React, { useMemo } from 'react';

import type { AppProps } from 'next/app';
import Head from 'next/head';
import Link from 'next/link';

import { insertGtmScript } from '../tracking/gtm';
import { FAVICON_URL, OG_IMAGE_URL, TWITTER_ACCOUNT_ID } from '../constants/site_data';
import { BUGSNAG_API_KEY } from '../constants/environment';
import { activateErrorBoundaryComponent } from '../components/ErrorBoundary';
import { PathList } from '../constants/path_list';
import { activateI18n, retrieveTranslation, setLocale } from '../locales/i18n';
import { createGAOptout } from '../tracking/ga_optout';
import { GTM_ID } from '../tracking/gtm_id';

import 'prismjs/themes/prism-okaidia.css';

import '../common_styles/foundation.css';
import '../common_styles/site_specific.css';
import '../common_styles/variables/variables.css';

import './app.page.css';

const BLUE_600 = '#003760';
const MAIN_COLOR = BLUE_600;

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  activateI18n();
  setLocale('ja');

  const title = useMemo(
    () =>
      retrieveTranslation('website.title')
        .split('、')
        .map((text, i, texts) => {
          if (texts.length === i + 1) {
            return `<span>${text}</span>`;
          }

          return `<span>${text}、</span>`;
        })
        .join(''),
    [],
  );

  const gaOptout = createGAOptout(GTM_ID);
  const webSiteTitle = retrieveTranslation('website.title');

  const element = (
    <>
      <Head>
        <meta name="theme-color" content={MAIN_COLOR} />
        <meta property="og:site_name" content={webSiteTitle} />
        <meta property="og:image" content={OG_IMAGE_URL} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={OG_IMAGE_URL} />
        <meta name="twitter:site" content={`@${TWITTER_ACCOUNT_ID}`} />
        <meta name="Hatena::Bookmark" content="nocomment" />
        <link rel="apple-touch-icon" href={FAVICON_URL} />
        <link rel="icon" type="image/png" href={FAVICON_URL} />
        <link rel="alternate" type="application/atom+xml" href={PathList.Feed} title={webSiteTitle} />
      </Head>
      {!gaOptout.enabled() && insertGtmScript(GTM_ID)}
      <div className="web-site-container">
        <header className="web-site-header">
          <h1 className="web-site-title">
            <Link href={PathList.Root} dangerouslySetInnerHTML={{ __html: title }} />
          </h1>
          <p className="web-site-description">{retrieveTranslation('website.description')}</p>
        </header>
        <main className="web-site-contents">
          <Component {...pageProps} />
        </main>
        <footer className="web-site-footer">
          <ul className="web-site-navigation">
            <li>
              <Link href={PathList.Feed}>{retrieveTranslation('navigation.feed')}</Link>
            </li>
            <li>
              <Link href={PathList.Policy}>{retrieveTranslation('navigation.policy')}</Link>
            </li>
          </ul>
          <p className="web-site-copyright">
            <small>© {retrieveTranslation('website.author')}</small>
          </p>
        </footer>
      </div>
    </>
  );

  if (!BUGSNAG_API_KEY) {
    return element;
  }

  const ErrorBoundary = activateErrorBoundaryComponent(BUGSNAG_API_KEY);

  return <ErrorBoundary>{element}</ErrorBoundary>;
}

export default MyApp;
