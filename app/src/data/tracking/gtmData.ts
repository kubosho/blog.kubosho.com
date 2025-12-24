import { IS_PRODUCTION_ENV } from '../../../constants/environment';

export const PRODUCTION_GTM_ID = 'GTM-WQNTM9W';
export const DEVELOPMENT_GTM_ID = 'GTM-5FH7ZXN';

export const GTM_ID = IS_PRODUCTION_ENV ? PRODUCTION_GTM_ID : DEVELOPMENT_GTM_ID;
export const GTM_URL = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}` as const;
