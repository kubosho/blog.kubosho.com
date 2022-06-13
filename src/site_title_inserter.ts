import { activateI18n, retrieveTranslation, setLocale } from './locales/i18n';

export function addSiteTitleToSuffix(title: string): string {
  activateI18n();
  setLocale('ja');

  const webSiteTitle = retrieveTranslation('website.title');
  return `${title} / ${webSiteTitle}`;
}
