/**
 * Environment variables and site configuration
 */

// Site basics
export const SITE_URL = import.meta.env.PUBLIC_SITE_URL || 'https://www.japantravellog.com';
export const SITE_TITLE = import.meta.env.PUBLIC_SITE_TITLE || '旅ログ - 日本全国の旅記録';
export const SITE_DESCRIPTION =
  import.meta.env.PUBLIC_SITE_DESCRIPTION ||
  '日本全国の旅ログを多言語で発信するブログ。各地の魅力を写真と文章でお届けします。';

// Sanity configuration
export const SANITY_PROJECT_ID = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
export const SANITY_DATASET = import.meta.env.PUBLIC_SANITY_DATASET || 'production';
export const SANITY_API_VERSION = import.meta.env.PUBLIC_SANITY_API_VERSION || '2024-01-01';

// Revenue configuration
export const BOOKING_AFFILIATE_ID = import.meta.env.PUBLIC_BOOKING_AFFILIATE_ID;
export const ADSENSE_CLIENT_ID = import.meta.env.PUBLIC_ADSENSE_CLIENT_ID;

// Analytics
export const GA_MEASUREMENT_ID = import.meta.env.PUBLIC_GA_MEASUREMENT_ID || 'G-JY45KB4MTV';

// Revalidation
export const REVALIDATE_SECRET = import.meta.env.REVALIDATE_SECRET;

// OGP cache busting version
export const OG_IMAGE_VERSION = import.meta.env.OG_IMAGE_VERSION ?? 'v4';