import { supportedLanguages } from '../../../supportedLanguages.js';

/**
 * Get all supported language IDs from the central supportedLanguages configuration
 * @returns Array of language codes (e.g. ['ja', 'en', 'zh-cn', ...])
 */
export const getLangIds = (): string[] => {
  return supportedLanguages.map(lang => lang.id);
};

/**
 * Get the full supported languages array
 * @returns Array of language objects with id and title
 */
export const getSupportedLanguages = () => {
  return supportedLanguages;
};

/**
 * Get hreflang code for a given language ID
 * Maps language codes to proper hreflang format
 */
export const getHreflangCode = (langId: string): string => {
  const hreflangMap: Record<string, string> = {
    'ja': 'ja',
    'en': 'en',
    'es': 'es',
    'fr': 'fr',
    'de': 'de',
    'it': 'it',
    'pt-br': 'pt-BR',
    'ru': 'ru',
    'ko': 'ko',
    'zh-cn': 'zh-Hans',
    'zh-tw': 'zh-Hant',
    'ar': 'ar',
    'tr': 'tr',
    'th': 'th',
    'nl': 'nl',
    'pl': 'pl',
    'sv': 'sv',
    'da': 'da',
    'fi': 'fi',
    'id': 'id'
  };
  
  return hreflangMap[langId] || langId;
};