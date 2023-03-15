import { retrieveTranslation } from './locales/i18n';

export function addSiteTitleToSuffix(title: string): string {
  const webSiteTitle = retrieveTranslation('website.title');
  return `${title} / ${webSiteTitle}`;
}
