import Head from 'next/head';

import { GTM_ID } from '../tracking/gtm_id';
import { createGAOptout } from '../tracking/ga_optout';
import { insertGtmScript } from '../tracking/gtm';
import { FAVICON_URL, OG_IMAGE_URL, TWITTER_ACCOUNT_ID } from '../constants/site_data';
import { PathList } from '../constants/path_list';
import { retrieveTranslation } from '../locales/i18n';

const BLUE_600 = '#003760';
const MAIN_COLOR = BLUE_600;

export const SiteMetadata = (): JSX.Element => {
  const gaOptout = createGAOptout(GTM_ID);
  const webSiteTitle = retrieveTranslation('website.title');

  return (
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
    </>
  );
};
