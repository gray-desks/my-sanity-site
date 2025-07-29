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
    'zh-cn': 'zh-Hans',
    'zh-tw': 'zh-Hant',
    'ko': 'ko',
    'th': 'th',
    'vi': 'vi',
    'id': 'id',
    'ms': 'ms',
    'tl': 'tl',
    'fr': 'fr',
    'de': 'de',
    'es': 'es',
    'it': 'it',
    'pt': 'pt',
    'ru': 'ru',
    'ar': 'ar',
    'hi': 'hi',
    'tr': 'tr',
    'pt-br': 'pt-BR'
  };
  
  return hreflangMap[langId] || langId;
};