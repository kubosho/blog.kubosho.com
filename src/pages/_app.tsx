import React, { useMemo } from 'react';

import type { AppProps } from 'next/app';
import Link from 'next/link';
import { isUndefined } from 'option-t/lib/Undefinable/Undefinable';

import { BUGSNAG_API_KEY } from '../constants/environment';
import { activateErrorBoundaryComponent } from '../components/ErrorBoundary';
import { PathList } from '../constants/path_list';
import { SiteMetadata } from '../components/SiteMetadata';
import { activateI18n, retrieveTranslation, setLocale } from '../locales/i18n';

import 'prismjs/themes/prism-okaidia.css';

import '../common_styles/foundation.css';
import '../common_styles/site_specific.css';
import '../common_styles/variables/variables.css';

import './app.page.css';

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

  const element = (
    <>
      <SiteMetadata />
      <header className="web-site-header">
        <h1 className="web-site-title">
          <Link href={PathList.Root} passHref>
            <a dangerouslySetInnerHTML={{ __html: title }} />
          </Link>
        </h1>
        <p className="web-site-description">{retrieveTranslation('website.description')}</p>
      </header>
      <main className="web-site-contents">
        <Component {...pageProps} />
      </main>
      <footer className="web-site-footer">
        <div className="web-site-links">
          <p>
            <Link href={PathList.Root} passHref>
              <a>{retrieveTranslation('website.title')}</a>
            </Link>
          </p>
          <ul className="web-site-navigation">
            <li>
              <Link href={PathList.Feed}>
                <a>{retrieveTranslation('navigation.feed')}</a>
              </Link>
            </li>
            <li>
              <Link href={PathList.Policy}>
                <a>{retrieveTranslation('navigation.policy')}</a>
              </Link>
            </li>
          </ul>
        </div>
        <p className="web-site-copyright">
          <small>© {retrieveTranslation('website.author')}</small>
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
