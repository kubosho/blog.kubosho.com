import React from 'react';

import type { AppProps } from 'next/app';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { isUndefined } from 'option-t/lib/Undefinable/Undefinable';

import { AUTHOR, SITE_DESCRIPTION, SITE_TITLE } from '../constants/site_data';
import { BUGSNAG_API_KEY } from '../constants/environment';
import { activateErrorBoundaryComponent } from '../components/ErrorBoundary';
import { PathList } from '../constants/path_list';
import { SiteMetadata } from '../components/SiteMetadata';

import 'prismjs/themes/prism-okaidia.css';
import '../common_styles/foundation.css';
import '../common_styles/site_specific.css';
import './variables.css';
import './app.page.css';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const router = useRouter();
  const isDisplayedDescription = ![PathList.Entry, PathList.Feed, PathList.Policy].includes(
    router.pathname as PathList,
  );

  const element = (
    <>
      <SiteMetadata />
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
