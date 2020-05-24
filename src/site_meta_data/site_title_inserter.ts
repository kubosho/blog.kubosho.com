import { SITE_TITLE } from '../constants/site_data';

export function addSiteTitleToSuffix(title: string): string {
  return `${title} ¦ ${SITE_TITLE}`;
}
