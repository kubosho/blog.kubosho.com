import { isProduction } from './environment';
import { LOCAL_SITE_URL, SITE_URL } from './site_data';

const API_V1_PATH = 'api/v1';
export const API_V1_URL = isProduction ? `${SITE_URL}/${API_V1_PATH}` : `${LOCAL_SITE_URL}/${API_V1_PATH}`;
