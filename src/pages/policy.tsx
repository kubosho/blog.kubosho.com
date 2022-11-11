import React, { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';

import { createGAOptout } from '../tracking/ga_optout';
import { GTM_ID } from '../tracking/gtm_id';
import { addSiteTitleToSuffix } from '../site_title_inserter';
import { retrieveTranslation } from '../locales/i18n';
import { SITE_URL } from '../constants/site_data';
import { PathList } from '../constants/path_list';

import styles from './policy.module.css';

const optout = createGAOptout(GTM_ID);

const PolicyPage = (): JSX.Element => {
  const webSiteTitle = retrieveTranslation('website.title');
  const pageTitle = retrieveTranslation('policy.title');
  const titleInHead = addSiteTitleToSuffix(pageTitle);
  const pageUrl = `${SITE_URL}${PathList.Policy}`;

  const [isEnabledOptout, setIsEnabledOptout] = useState(false);

  useEffect(() => {
    setIsEnabledOptout(optout.enabled());
  }, []);

  const onClickOptoutButton = useCallback(() => {
    if (optout.enabled()) {
      setIsEnabledOptout(false);
      optout.disable();
    } else {
      setIsEnabledOptout(true);
      optout.enable();
    }
  }, [setIsEnabledOptout]);

  return (
    <React.Fragment>
      <Head>
        <title>{titleInHead}</title>
        <meta property="og:title" content={titleInHead} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
      </Head>
      <article className={styles.entry}>
        <h2 className={styles.title}>{pageTitle}</h2>
        <p>{retrieveTranslation('policy.intro.text', { webSiteTitle })}</p>
        <h3 className={styles['sub-title']}>{retrieveTranslation('policy.headings.privacy')}</h3>
        <div className={styles['entry-contents']}>
          <p>{retrieveTranslation('policy.text.privacy.1')}</p>
          <p>{retrieveTranslation('policy.text.privacy.2')}</p>
          <p>{retrieveTranslation('policy.text.privacy.3')}</p>
          <p>
            {retrieveTranslation('policy.text.privacy.4')}
            <a href="https://policies.google.com/technologies/partner-sites">
              {retrieveTranslation('policy.text.privacy.5')}
            </a>
            {retrieveTranslation('policy.text.privacy.6')}
          </p>
        </div>
        <h4 className={styles['sub-title']}>{retrieveTranslation('policy.headings.optout')}</h4>
        <p>{retrieveTranslation('policy.text.optout.1')}</p>
        <button type="button" onClick={onClickOptoutButton}>
          {isEnabledOptout
            ? retrieveTranslation('optout.actions.disabled')
            : retrieveTranslation('optout.actions.enabled')}
        </button>
        <p>
          <output
            dangerouslySetInnerHTML={{
              __html: isEnabledOptout
                ? retrieveTranslation('optout.status.enabled')
                : retrieveTranslation('optout.status.disabled'),
            }}
          />
        </p>
        <h3 className={styles['sub-title']}>{retrieveTranslation('policy.headings.affiliate')}</h3>
        <p>{retrieveTranslation('policy.text.affiliate.1', { webSiteTitle })}</p>
        <h3 className={styles['sub-title']}>{retrieveTranslation('policy.headings.disclaimer')}</h3>
        <p>{retrieveTranslation('policy.text.disclaimer.1')}</p>
        <p>{retrieveTranslation('policy.text.disclaimer.2')}</p>
        <p>{retrieveTranslation('policy.text.disclaimer.3')}</p>
      </article>
    </React.Fragment>
  );
};

export default PolicyPage;
