import { ENABLED_LANGUAGES, getHreflangCode } from './i18n';

/**
 * Get all supported language IDs from the unified i18n configuration
 * @returns Array of language codes (e.g. ['ja', 'en', 'zh-cn', ...])
 */
export const getLangIds = (): string[] => {
  return ENABLED_LANGUAGES.map(lang => lang.id);
};

/**
 * Get the full supported languages array from i18n
 * @returns Array of language objects
 */
export const getSupportedLanguages = () => {
  return ENABLED_LANGUAGES;
};

// Re-export getHreflangCode from i18n to ensure a single source of truth
export { getHreflangCode };