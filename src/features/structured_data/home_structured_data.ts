import { SITE_URL } from '../../../constants/site_data';
import { retrieveTranslation } from '../../features/locales/i18n';

// https://developers.google.com/search/docs/appearance/site-names#website
export interface HomeStructuredData {
  '@context': 'http://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
}

export function createHomeStructuredData(): HomeStructuredData {
  const data = {
    '@context': 'http://schema.org' as const,
    '@type': 'WebSite' as const,
    name: retrieveTranslation('website.title'),
    url: SITE_URL,
  };

  return data;
}
