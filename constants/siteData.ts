export const BASE_LANGUAGE = 'ja' as const;

export const AUTHOR = 'kubosho' as const;

export const SITE_HOSTNAME = 'blog.kubosho.com' as const;
export const SITE_URL = `https://${SITE_HOSTNAME}` as const;

export const TWITTER_ACCOUNT_ID = `${AUTHOR}_` as const;
export const FACEBOOK_APP_ID = '2453282784920956' as const;

export const ASSETS_URL = 'https://blog-assets.kubosho.com' as const;
export const FAVICON_URL = `${ASSETS_URL}/icon.png` as const;

export const OG_IMAGE_PATH = `${ASSETS_URL}/images/og` as const;
export const FALLBACK_OG_IMAGE_URL = `${OG_IMAGE_PATH}/fallback_og_image.png` as const;
