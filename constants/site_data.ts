export const BASE_LANGUAGE = 'ja';

export const AUTHOR = 'kubosho';
export const AUTHOR_WITH_UNDERSCORE = `${AUTHOR}_`;

export const SITE_HOSTNAME = 'blog.kubosho.com' as const;
export const SITE_URL = `https://${SITE_HOSTNAME}` as const;
export const LOCAL_SITE_HOSTNAME = 'localhost' as const;
export const LOCAL_SITE_PORT = 4321 as const;
export const LOCAL_SITE_URL = `http://${LOCAL_SITE_HOSTNAME}:${LOCAL_SITE_PORT}` as const;

export const TWITTER_ACCOUNT_ID = AUTHOR_WITH_UNDERSCORE;
export const FACEBOOK_APP_ID = '2453282784920956';

export const FAVICON_URL = 'https://blog-assets.kubosho.com/icon.png';
export const OG_IMAGE_URL = 'https://blog-assets.kubosho.com/og_image.png';
