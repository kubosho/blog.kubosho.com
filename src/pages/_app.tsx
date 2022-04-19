import React from 'react';

import type { AppProps } from 'next/app';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { isUndefined } from 'option-t/lib/Undefinable/Undefinable';

import {
  AUTHOR,
  FAVICON_URL,
  OG_IMAGE_URL,
  SITE_DESCRIPTION,
  SITE_TITLE,
  TWITTER_ACCOUNT_ID,
} from '../constants/site_data';
import { GTM_ID } from '../tracking/gtm_id';
import { insertGtmScript } from '../tracking/gtm';
import { BUGSNAG_API_KEY } from '../constants/environment';
import { createGAOptout } from '../tracking/ga_optout';
import { activateErrorBoundaryComponent } from '../components/ErrorBoundary';
import { PathList } from '../constants/path_list';

import 'prismjs/themes/prism-okaidia.css';
import '../common_styles/foundation.css';
import '../common_styles/site_specific.css';
import './variables.css';
import './app.page.css';

const BLUE_600 = '#003760';
const MAIN_COLOR = BLUE_600;

const gaOptout = createGAOptout(GTM_ID);

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const router = useRouter();
  const isDisplayedDescription = ![PathList.Entry, PathList.Feed, PathList.Policy].includes(
    router.pathname as PathList,
  );

  const element = (
    <>
      <Head>
        <meta name="theme-color" content={MAIN_COLOR} />
        <meta property="og:site_name" content={SITE_TITLE} />
        <meta property="og:image" content={OG_IMAGE_URL} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:image" content={OG_IMAGE_URL} />
        <meta name="twitter:site" content={`@${TWITTER_ACCOUNT_ID}`} />
        <meta name="Hatena::Bookmark" content="nocomment" />
        <link rel="apple-touch-icon" href={FAVICON_URL} />
        <link rel="icon" type="image/png" href={FAVICON_URL} />
        <link rel="alternate" type="application/atom+xml" href={PathList.Feed} title={SITE_TITLE} />
        {!gaOptout.enabled() && insertGtmScript(GTM_ID)}
      </Head>
      <header className="site-header">
        <h1 className="site-title">
          <Link href={PathList.Root} passHref>
            <a>{SITE_TITLE}</a>
          </Link>
        </h1>
        {isDisplayedDescription && <p className="site-description">{SITE_DESCRIPTION}</p>}
      </header>
      <Component {...pageProps} />
      <footer className="site-footer">
        <div className="site-links">
          <p>
            <Link href={PathList.Root} passHref>
              <a>{SITE_TITLE}</a>
            </Link>
          </p>
          <ul className="site-navigation">
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
        </div>
        <p className="site-copyright">
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

export default MyApp;
